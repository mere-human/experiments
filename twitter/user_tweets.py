'''
Generates user's tweets HTML report.
Sample invocation:
python3 user_tweets.py --json result.json --reverse --verbose --user Niseworks
'''

import requests
import os
import json
import logging
import argparse

# To set your environment variables in your terminal run the following line:
# export 'BEARER_TOKEN'='<your_bearer_token>'
bearer_token = os.environ.get("BEARER_TOKEN")


def parse_args():
    parser = argparse.ArgumentParser(
        description="Generates user's tweets HTML report.")
    parser.add_argument('--user',
                        help='Twitter user name.')
    parser.add_argument('--max', type=int,
                        help='Number of tweets to obtain. Max supported value is 3200 (API limit).')
    parser.add_argument('--json',
                        help='Input JSON file with response to generate report from.')
    parser.add_argument('--dump', action='store_true',
                        help='Dump JSON file with response.')
    parser.add_argument('--reverse', action='store_true',
                        help='If specified, write user tweets are in chronological (reverse) order.')
    parser.add_argument('--verbose', action='store_true',
                        help='Print more info.')
    parser.add_argument('--attachments', action='store_true',
                        help='Include only tweets with attachments.')
    return parser.parse_args()


def check_response(response):
    if response.status_code != 200:
        raise RuntimeError(
            f'Response error: {response.status_code} {response.text}')


def bearer_oauth(r):
    """
    Method required by bearer token authentication.
    """

    r.headers["Authorization"] = f"Bearer {bearer_token}"
    r.headers["User-Agent"] = "v2UserTweetsPython"
    return r


def get_user_id(username):
    url = f"https://api.twitter.com/2/users/by"
    params = {'usernames': username}
    response = requests.request("GET", url, params=params, auth=bearer_oauth)
    check_response(response)
    jresp = response.json()
    return jresp['data'][0]['id']


def get_tweets(uid, max_results=None, pagination_token=None, start_time=None, end_time=None):
    """
    max_results = [5,10] (default: 10)
    JSON response format:
    {
        data: [{attachements: {media_keys: [str, ...]}, created_at: str, id: str, text: str, entities: {urls: []}}, ...],
        includes: {media: [{media_key: str, type: str, url: str}, ...]},
        meta: {newest_id: str, next_token: str, , oldest_id: str, result_count: int}
    }
    next_token is for pagination.
    """
    url = f"https://api.twitter.com/2/users/{uid}/tweets"
    # exclude is a comma-separated list that can include retweets and replies. For retweets max tweets is 3200 but for replies max tweets is 800.
    params = {'max_results': max_results, 'pagination_token': pagination_token, 'tweet.fields': 'created_at,entities', 'expansions': 'attachments.media_keys',
              'media.fields': 'type,url,preview_image_url,variants,height,width', 'start_time': start_time, 'end_time': end_time, 'exclude': 'retweets'}
    response = requests.request("GET", url, params=params, auth=bearer_oauth)
    check_response(response)
    jresp = response.json()
    return jresp


class HtmlFormatter:
    def __init__(self, user_name):
        self.user_name = user_name
        self.lines = []

    def add_prolog(self):
        self.lines.append(self.get_prolog())

    def get_prolog(self):
        return f'''
<!DOCTYPE html>
<html>
<head>
    <style>
        hr {{
            page-break-after: always;
        }}
        p,div.twi_img {{
            page-break-inside: avoid;
        }}
        @media not print {{
            .printonly {{
                display: none;
            }}
        }}
        @media print {{
            .noprint {{
                display: none;
            }}
            .printonly {{
                visibility: visible;
            }}
        }}
    </style>
</head>
<body>
<h1>{self.user_name} tweets</h1>'''

    def get_epilog(self):
        return '''
</body>
</html>'''

    def add_epilog(self):
        self.lines.append(self.get_epilog())

    def add_tweet(self, title, id, text, extra=''):
        text = text.replace('\n', '<br/>')
        self.lines.append(self.get_h2(title, id, text, extra))

    def get_h2(self, title, id, text, extra=''):
        return f'''
<h2>{title}</h2>
<p><a href="https://twitter.com/{self.user_name}/status/{id}">{id}</a></p>
<p>{text}</p>
{extra}
<hr/>
'''

    def get_img(self, url):
        return f'''<div class="tw_img"><img src="{url}"/></div>'''

    def get_video(self, w, h, preview, url, type):
        return f'''
<video class="noprint" width="{w}" height="{h}" poster="{preview}" controls>
    <source src="{url}" type="{type}">
</video>
<img class="twi_img printonly" src="{preview}" />
'''

    def get_video_header(self):
        return '<p><small><i>Video:</i></small></p>'

    def get_url(self, url, text):
        return f'<a href="{url}">{text}</a>'

    def get_result(self):
        return ''.join(self.lines)


# Returns media data by media_key
def get_media_dict(tweets_json):
    media_list = tweets_json['includes']['media'] if 'includes' in tweets_json else [
    ]
    media = {}
    for m in media_list:
        # https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/media
        # {'width': 1000, 'type': 'video', 'height': 1280, 'preview_image_url': 'https://pbs.twimg.com/ext_tw_video_thumb/1556488702926508032/pu/img/IpEtPoX8vyK_0pFM.jpg', 'media_key': '7_1556488702926508032', 'variants': [{...}, {...}, {...}, {...}]}
        # {'url': 'https://pbs.twimg.com/media/FZgrgNHX0AESi_5.jpg', 'width': 2400, 'media_key': '3_1556041503532896257', 'type': 'photo', 'height': 3840}
        if m['type'] == 'photo':
            media[m['media_key']] = m
        elif m['type'] in ['video', 'animated_gif']:
            best_variant = max(
                m['variants'], key=lambda x: x['bit_rate'] if 'bit_rate' in x else 0)
            m.update(best_variant)
            media[m['media_key']] = m
        else:
            logger.warning(f'Unknown media type: {m["type"]} in {m}')
    return media


def generate_attachments(media, tweet_attachment, formatter, tweet_id):
    result = []
    for attachement in tweet_attachment:
        mv = media.get(attachement)
        if mv is None:
            logger.warning(f'Unknown attachment in tweet "{tweet_id}"')
        if mv:
            if mv['type'] == 'photo':
                result.append(formatter.get_img(url=mv['url']))
            else:
                result.append(formatter.get_video_header())
                result.append(formatter.get_video(
                    w=mv['width'], h=mv['height'], preview=mv['preview_image_url'], url=mv['url'], type=mv['content_type']))
    return result

def expand_urls(tweet, text, formatter):
    entities = tweet.get('entities')
    if entities:
        for u in entities['urls']:
            expanded = u['expanded_url']
            # Ignore links containing 'twitter'.
            # It's mainly done because such links lead to media files.
            # And media are handled separately as attachments.
            replacement = '' if 'twitter' in expanded else formatter.get_url(
                expanded, u['display_url'])
            text = text.replace(u['url'], replacement)
    return text

def generate_html(tweets_json, user_name, reverse=False, attachments_only=False):
    meta = tweets_json.get('meta')
    logger.debug(f'meta: {meta}')
    logger.debug(f'"data" len: {len(tweets_json["data"])}')

    formatter = HtmlFormatter(user_name)
    formatter.add_prolog()

    tweets_data = tweets_json['data']
    for i, tweet in enumerate(reversed(tweets_data) if reverse else tweets_data):
        attachments = tweet.get('attachments')
        if attachments:
            attachments = attachments['media_keys']
        elif attachments_only:
            continue
        else:
            attachments = []
        created = tweet['created_at']
        html_extra = generate_attachments(get_media_dict(
            tweets_json), attachments, formatter, created)
        text = expand_urls(tweet, tweet['text'], formatter)
        formatter.add_tweet(
            title=f'{i+1}. {created}', text=text, extra='\n'.join(html_extra), id=tweet['id'])
    formatter.add_epilog()
    with open('result.html', 'w') as f:
        f.write(formatter.get_result())


def merge_json(a, b):
    if not a and b:
        return b
    elif not b:
        return a
    a['data'].extend(b['data'])
    a['includes']['media'].extend(b['includes']['media'])
    return a


def get_tweets_iter(uid, max_tweets=None):
    result = {}
    pagination_token = None
    try:
        while True:
            tweets = get_tweets(uid, max_results=min(100, max_tweets) if max_tweets else 100,
                                pagination_token=pagination_token)
            result = merge_json(result, tweets)
            pagination_token = tweets['meta'].get('next_token')
            if not pagination_token:
                logger.debug(f'No pagination token, stop. {tweets["meta"]}')
                break
            if max_tweets is not None:
                max_tweets = max(max_tweets-100, 0)
                logger.debug(f'Tweets left: {max_tweets}')
                if max_tweets == 0:
                    break
    except BaseException as err:
        logger.exception(err)
    return result


def main():
    args = parse_args()

    logging.basicConfig(
        level=(logging.DEBUG if args.verbose else logging.INFO))
    global logger
    logger = logging.getLogger('user_tweets')

    logger.debug(args)

    if args.json:
        username = args.user if args.user else 'Unknown'
        with open(args.json, 'r') as f:
            tweets = json.load(f)
    else:
        username = args.user
        uid = get_user_id(username)
        logger.debug(f'{username}: {uid}')
        tweets = get_tweets_iter(uid, max_tweets=args.max)
        if args.dump:
            with open('result.json', 'w') as f:
                f.write(json.dumps(tweets, indent=4, sort_keys=True))

    # tweets = get_tweets(uid, end_time='2016-03-30T22:11:18.000Z', max_results=100)
    # oldest attachment: 2016-02-10T18:04:32.000Z https://t.co/8mSy5gFswd
    # oldest tweet http://t.co/hSPfs5deDf
    generate_html(tweets, username, attachments_only=args.attachments,
                  reverse=args.reverse)


if __name__ == "__main__":
    main()

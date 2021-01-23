import pandas as pd
import threading
import stream_finder
import sys
import math
import time

imdb_path = '../IMDB-Files/'
numVotes_cap = 50000
num_threads = 6 if len(sys.argv) < 2 else int(sys.argv[1])

# basics = pd.read_csv('../IMDB-Files/title.basics.sample.tsv', sep='\t', index_col=0)
basics = pd.read_csv(imdb_path + 'title.basics.tsv', sep='\t', index_col=0)
basics = basics.drop(['endYear', 'isAdult'], axis=1)
print('title.basics read')

ratings = pd.read_csv(imdb_path + 'title.ratings.tsv', sep='\t', index_col=0)
print('title.ratings read')

movies = basics.loc[basics['titleType'] == 'movie']
print('filtered titles by movies')

movies_rating = []
movies_votes = []
for index, movie in movies.iterrows():
    movie_rating = None
    try:
        movie_rating = ratings.loc[index, 'averageRating']
    except:
        movie_rating = -1
    movies_rating.append(movie_rating)

    movie_votes = None
    try:
        movie_votes = ratings.loc[index, 'numVotes']
    except:
        movie_votes = 0
    movies_votes.append(movie_votes)
movies['rating'] = movies_rating
movies['numVotes'] = movies_votes
print('cross referenced ratings')

movies = movies[movies['numVotes'] > numVotes_cap].drop(['numVotes'], axis=1)
movies = movies.sort_values(by=['rating'], ascending=False)
print('sorted by ratings')

def get_services(movies, streaming_services, offset):
    i = 0
    for index, movie in movies.iterrows():
        services = None
        try:
            services = stream_finder.find(movie['primaryTitle'], True)
        except:
            services = []
        streaming_services[offset + i] = services
        i += 1

def count_thread_progress(streaming_services):
    while True:
        count = 0
        for services in streaming_services:
            count += 0 if services is None else 1
        print('cross referenced streaming services: ' + str(count) + '/' + str(len(streaming_services)))
        global stop_counting
        if stop_counting:
            break
        time.sleep(1)

threads = []
movie_count = movies.shape[0]
streaming_services = [None] * movie_count
n_size = math.ceil(movie_count / num_threads)
for i in range(num_threads):
    movies_s = None
    if i + 1 != num_threads:
        movies_s = movies.iloc[i * n_size:(i + 1) * n_size, :]
    else:
        movies_s = movies.iloc[i * n_size:, :]
    th = threading.Thread(target=get_services, args=[movies_s, streaming_services, i * n_size])
    threads.append(th)
    th.start()

th_count = threading.Thread(target=count_thread_progress, args=[streaming_services])
stop_counting = False
th_count.start()

for th in threads:
    th.join()
stop_counting = True
th_count.join()

movies['streaming_service'] = streaming_services
print('cross referenced streaming services completed')

# movie_count = movies.shape[0]
# i_count = 0
# streaming_services = []
# for index, movie in movies.iterrows():
#     services = None
#     try:
#         services = stream_finder.find(movie['primaryTitle'])
#     except:
#         services = []
#     streaming_services.append(services)
#     i_count += 1
#     print('cross referenced streaming services: ' + str(i_count) + '/' + str(movie_count))
# movies['streaming_service'] = streaming_services
# print('cross referenced streaming services completed')

movies.to_csv(imdb_path + 'movies.tsv', sep='\t')
print(movies)

import pandas as pd
import json

imdb_path = '../IMDB-Files/'
movies = pd.read_csv(imdb_path + 'movies.tsv', sep='\t', index_col=0)

movies['genres'] = movies['genres'].map(lambda d: d.split(','))
movies['streaming_service'] = movies['streaming_service'].map(lambda x: list(map(lambda y: y[1:-1], x[1:-1].replace(' ', '').split(','))))
movies = movies[movies['streaming_service'].map(lambda d: d[0]) != '']
movies = movies.drop(['titleType', 'originalTitle'], axis=1)

db_json = {}
fields = list(movies.columns)

for index, movie in movies.iterrows():
    movie_json = {}
    for field in fields:
        movie_json[field] = movie[field]
    db_json[index] = movie_json

with open(imdb_path + 'movies.json', 'w') as f:
    json.dump(db_json, f)

import requests
from bs4 import BeautifulSoup
import sys

def find(movie_name, print_out=False):
    search_url = 'https://decider.com/search/' + movie_name.replace(' ', '+')
    search = requests.get(search_url)
    search_html = BeautifulSoup(search.content, 'html.parser')
    movie_url_el = search_html.find('h1', {'class': 'search-match-show-title'})
    current_services = []
    if movie_url_el != None:
        movie_url = movie_url_el.find('a')['href']
        movie = requests.get(movie_url)
        movie_html = BeautifulSoup(movie.content, 'html.parser')
        services = movie_html.findAll('li', {'class': 'reelgood-platform-link'})
        current_services = parse_services(services)
    if print_out and len(current_services) > 0:
        current_services_str = ', '.join(current_services) if len(current_services) > 0 else 'None'
        print(movie_name + ': ' + current_services_str)
    return current_services

def parse_services(lis):
    services = []
    avaliable_services = ['netflix', 'disney_plus', 'amazon_prime', 'hulu', 'hbo_max']
    for li in lis:
        img_src = li.find('img')['src']
        img_name = img_src.rsplit('/', 1)[-1].rsplit('.', 1)[0]
        if img_name in avaliable_services:
            services.append(img_name)
    return services

# print(find(sys.argv[1]))

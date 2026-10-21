
(function () {
    'use strict';

    if (window.russian_catalog_lampa_ready) return;
    window.russian_catalog_lampa_ready = true;

    var ICON = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 3v11h16V7H4zm2 2h5v2H6V9zm0 4h12v2H6v-2z"/></svg>';

    var movies = [
        {title:'Все фильмы',id:''},
        {title:'Боевики',id:28},
        {title:'Комедии',id:35},
        {title:'Ужасы',id:27},
        {title:'Детективы',id:9648},
        {title:'Драмы',id:18},
        {title:'Криминал',id:80},
        {title:'Мелодрамы',id:10749},
        {title:'Приключения',id:12},
        {title:'Фантастика',id:878},
        {title:'Триллеры',id:53},
        {title:'Фэнтези',id:14},
        {title:'Мультфильмы',id:16}
    ];

    var series = [
        {title:'Все сериалы',id:''},
        {title:'Боевики и приключения',id:10759},
        {title:'Комедии',id:35},
        {title:'Драмы',id:18},
        {title:'Детективы',id:9648},
        {title:'Криминал',id:80},
        {title:'Мелодрамы',id:10766},
        {title:'Фантастика и фэнтези',id:10765},
        {title:'Семейные',id:10751}
    ];

    function select(title, items, callback) {
        Lampa.Select.show({
            title: title,
            items: items.map(function (item) {
                return {title:item.title,id:item.id};
            }),
            onSelect: callback,
            onBack: function () {
                Lampa.Controller.toggle('menu');
            }
        });
    }

    function catalog(type, genre) {
        var tv = type === 'tv';
        var path = tv ? 'discover/tv' : 'discover/movie';
        var title = tv ? 'Российские сериалы' : 'Российские фильмы';
        var query = 'with_original_language=ru&sort_by=' +
            (tv ? 'first_air_date.desc' : 'primary_release_date.desc') +
            '&include_adult=false';

        if (genre && genre.id) {
            query += '&with_genres=' + genre.id;
            title += ' — ' + genre.title.toLowerCase();
        }

        Lampa.Activity.push({
            url: path + '?' + query,
            title: title,
            component: 'category',
            source: 'tmdb',
            page: 1
        });
    }

    function openRussia() {
        select('Российское кино', [
            {title:'Российские фильмы',id:'movie'},
            {title:'Российские сериалы',id:'tv'}
        ], function (item) {
            var tv = item.id === 'tv';
            select(
                tv ? 'Жанр российских сериалов' : 'Жанр российских фильмов',
                tv ? series : movies,
                function (genre) {
                    catalog(item.id, genre);
                }
            );
        });
    }

    function init() {
        if (Lampa.Menu && Lampa.Menu.addButton) {
            Lampa.Menu.addButton(ICON, 'Россия', openRussia);
        } else if (Lampa.Noty) {
            Lampa.Noty.show('Не найдено меню Lampa');
        }
    }

    if (window.appready) {
        init();
    } else if (Lampa.Listener && Lampa.Listener.follow) {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') init();
        });
    }
})();

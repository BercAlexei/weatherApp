'use strict'

document.addEventListener('DOMContentLoaded', () => {

    //modal
    const modal = document.querySelector('.modal'),
          setting = document.querySelector('.btn_setting'),
          closeModal = document.querySelector('.modal__window-close');

    setting.addEventListener('click', (event) => {
        event.preventDefault();
        modal.classList.add('active');
        document.querySelector('body').style.overflow = 'hidden'
    });

    closeModal.addEventListener('click', (event) => {
        event.preventDefault();
        modal.classList.remove('active');
        document.querySelector('body').style.overflow = '';
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
            document.querySelector('body').style.overflow = '';
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape') {
            modal.classList.remove('active');
            document.querySelector('body').style.overflow = '';
        }
    });

    //theme

    const root = document.querySelector(':root'),
          darkTheme = document.querySelector('#dark'),
          btnSub = document.querySelector('.btn_submit'),
          radioBtns = document.querySelectorAll('[data-radio]');

    //функция по изменению переменных для темы 
    function setNewVarCss (bgColor, winBgColor, textColor, buttonColorNotActive) {
        root.style.setProperty('--bg-color', bgColor)
        root.style.setProperty('--window-bg-color', winBgColor)
        root.style.setProperty('--text-color', textColor )
        root.style.setProperty('--button-color-not-active', buttonColorNotActive )
    }

    function changeTheme() {
        if (darkTheme.checked) {
            setNewVarCss('#323232', '#535353', 'white', '#323232')
        } else {
            setNewVarCss('#F1F5FE', '#ffffff', 'black', '#EDEDED')
        }
    }

    if(localStorage.getItem('dark') === 'true') {
        darkTheme.checked = true;
    };

    changeTheme();

    radioBtns.forEach(item => {
        item.addEventListener('click', changeTheme);
    });

    btnSub.addEventListener('click', (e) => {
        e.preventDefault();
        
        if(darkTheme.checked) {
            localStorage.setItem('dark', true);
        } else {
            localStorage.setItem('dark', false);
        }

        document.querySelector('body').style.overflow = '';
    
        modal.classList.remove('active');

        city.value = '';
    })

    //geolocation
    const city = document.querySelector('#city'),
          cityName = document.querySelector('h1'),
          weatherNow = document.querySelector('.weather__now'),
          spinner = document.querySelector('.spinner'),
          res = new Promise(resolve => {
            navigator.geolocation.getCurrentPosition(item =>  {            
                resolve(item.coords);
            });
          });
    //получение погоды по геопозиции
    res.then(({latitude, longitude} = item) => {

        getWeatherOfCitys(latitude, longitude);
        getWeatherHourAndDay(latitude, longitude);
    });
    // вызов функции getWeather 
    city.addEventListener('change', () => {
        getWeather();
    })
    // получение погоды по ширине и долготе, вывод данных на экран
    function getWeatherOfCitys(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=42b9a336a38eb7423f252b2cae144b48&lang=ru&units=metric`)
            .then(response => {
                if(response.status === 200){
                    spinner.classList.add('hide');
                    return response.json();
                }
            })
            .then(data => {
                cityName.textContent = data.name;
                weatherNow.innerHTML = `
                    <div class="weather__now-item">
                        <div class="weather__now-icon">
                            <img src="icons/weather/${data.weather[0].icon}.svg" alt="sunny">
                        </div>
                        <div class="weather__now-temp">${Math.round(data.main.temp)}&deg;C</div>
                    </div>

                    <div class="weather__now-descr">
                        <div class="weather__now-descr-text li">${data.weather[0].description}</div>
                        <div class="weather__now-descr-feel li">
                            Ощущется: <span>${Math.round(data.main.feels_like)} &deg;C</span>
                        </div>
                        <div class="weather__now-descr-wind li">
                            Ветер: <span>${Math.round(data.wind.speed)} </span>м/с
                        </div>
                    </div>
                `
            });
    };
    //получение погоды для часов и дней
    function getWeatherHourAndDay (lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=42b9a336a38eb7423f252b2cae144b48&lang=ru&units=metric`)
            .then(resp => {
                return resp.json();
            })
            .then(data => {
                let timezone = data.timezone;
                //библиотека momentjs для работы с датами(не получалось выводить время для часовых поясов(города))
                moment.locale('ru');
                //вызов переборов массивов и создание блоков(часы и дни)
                sortArrHourOrDay(data.hourly, timezone, 'HH',  weatherHour);
                sortArrHourOrDay(data.daily, timezone, 'dddd', weatherDay);
                //слайдер
                tns({
                    container: '.slider__wrapper',
                    slideBy: 3,
                    autoplay: false,
                    slideBy: 1,
                    nav: false,
                    fixedWidth: 110,
                    loop: false,
                    prevButton: '.btn_prev',
                    nextButton: '.btn_next',
                    responsive: {
                        768: {
                            controls: true,
                            
                        },
                        320: {
                            controls: false
                        }
                    }
                });
            });
    };
    //получение широты и долготы по названию города, для передачи в  getWeatherOfCitys и getWeatherHourAndDay
    function getWeather() {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value.trim()}&appid=42b9a336a38eb7423f252b2cae144b48&lang=ru&units=metric`)
            .then(response => {
                if(!response.ok){
                    cityName.textContent = 'Город не найден!'
                }
                if(response.status === 200){
                    spinner.classList.add('hide')
                    return response.json();
                }
            })
            .then(data => {
                const lat = data.coord.lat,
                      lon = data.coord.lon,
                      weatherOfHour = document.querySelectorAll('.slider-item'),
                      weatherOfDay = document.querySelectorAll('.weather__dayly-item');
                //удаление созданных блоков(часы и дни), для создания новых
                removeWeather(weatherOfHour);
                removeWeather(weatherOfDay);

                getWeatherOfCitys(lat, lon);
                getWeatherHourAndDay(lat, lon);
            });
    };
    //создание классов для фомирования погоды по часам и дням
    class WeatherHourAndDay {
        constructor(time, icon, temp) {
            this.time = time;
            this.icon = icon;
            this.temp = temp;
        }
    };

    class weatherHour extends WeatherHourAndDay {
        constructor(time, icon, temp) {
            super(time, icon, temp);
        }

        render() {
            const hour = document.createElement('div'),
                  weatherHoury = document.querySelector('.slider__wrapper');

            hour.classList.add('slider-item');
            hour.innerHTML = `
                <div class="slider-hour">${this.time}</div>
                <div class="slider-temp">
                    <div class="slider-temp-icon">
                        <img src="icons/weather/${this.icon}.svg" alt="${this.icon}">
                    </div>
                    <div class="slider__hourly-temp-text">
                        ${Math.round(this.temp)}&deg;C
                    </div>
                </div>
            `
            weatherHoury.append(hour);
        }
    };

    class weatherDay extends WeatherHourAndDay {
        constructor(time, icon, temp) {
            super(time, icon, temp);
        }

        render() {
            const day = document.createElement('div'),
                  weatherDays = document.querySelector('.weather__dayly');

            day.classList.add('weather__dayly-item');
            day.innerHTML = `
                <div class="weather__dayly-day">${this.time}</div>
                <div class="weather__dayly-icon">
                    <img src="icons/weather/${this.icon}.svg" alt="${this.icon}">
                </div>
                <div class="weather__dayly-temp">
                    ${Math.round(this.temp)}&deg;C
                </div>
            `
            weatherDays.append(day);
        }
    };
    //функция по перебору массивов полученных из getWeatherHourAndDay и вызов классов для создания новых блоков
    function sortArrHourOrDay(arr, timezone, format, nameClass) {
        arr.shift(0);            
        arr.forEach(item => {
            let time = moment.tz(item.dt * 1000, timezone).format(format),
                icon = item.weather[0].icon;
                temp = item.temp.day ?? item.temp;

            new nameClass(time, icon, temp).render();
        });
    };
    //функция по удалению блоков погоды(часы и дни)
    function removeWeather(selector) {
        selector.forEach(item => {
            item.remove()
        })
    };
});

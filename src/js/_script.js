'use strict'



// console.log(moment())

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
    
        modal.classList.remove('active')

        city.value = '';
    })

    //geolocation
    const city = document.querySelector('#city'),
          cityName = document.querySelector('h1'),
          weatherNow = document.querySelector('.weather__now'),
          spinner = document.querySelector('.spinner');


    const res = new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(item =>  {            
            resolve(item.coords);
        });
    });

    res.then(({latitude, longitude} = item) => {

        weatherOfCitys(latitude, longitude);
        weatherOfHourDay(latitude, longitude);
    });

    city.addEventListener('change', () => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=42b9a336a38eb7423f252b2cae144b48&lang=ru&units=metric`)
            .then(response => {
                if(!response.ok){
                    cityName.textContent = 'Город не найден!'
                }
                if(response.status === 200){
                    spinner.classList.add('hide')
                    return response.json();
                }
                return response.json();
            })
            .then(data => {
            let lat = data.coord.lat,
                lon = data.coord.lon;

                document.querySelectorAll('.slider-item').forEach(item => {
                    item.remove()
                })
                document.querySelectorAll('.weather__dayly-item').forEach(item => {
                    item.remove()
                })

                weatherOfCitys(lat, lon);
                weatherOfHourDay(lat, lon);
            });
    }) ;

    function weatherOfCitys(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=42b9a336a38eb7423f252b2cae144b48&lang=ru&units=metric`)
            .then(response => {

                if(response.status === 200){
                    spinner.classList.add('hide')
                    return response.json();
                }
                if(!response.ok){
                    cityName.textContent = 'Город не найден!'
                }
            })
            .then(data => {
                cityName.textContent = data.name;
                weatherNow.innerHTML = `
                    <div class="weather__now-item">
                        <div class="weather__now-icon">
                            <img src="icons/weather/${data.weather[0].icon}.svg" alt="sunny">
                        </div>
                        <div class="weather__now-temp">${Math.round(data.main.temp)} &deg;C</div>
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
            })
    }

    function weatherHourly(time, icon, temp) {
        const hour = document.createElement('div'),
            weatherHoury = document.querySelector('.slider__wrapper');;

        hour.classList.add('slider-item');
        hour.innerHTML = `
            <div class="slider-hour">${time}</div>
            <div class="slider-temp">
                <div class="slider-temp-icon">
                    <img src="icons/weather/${icon}.svg" alt="${icon}">
                </div>
                <div class="slider__hourly-temp-text">
                    ${Math.round(temp)} &deg;C
                </div>
            </div>
        `
        weatherHoury.append(hour);
    }

    function weatherDaily(time, icon, temp) {
        const day = document.createElement('div'),
            weatherDays = document.querySelector('.weather__dayly');

        day.classList.add('weather__dayly-item');
        day.innerHTML = `
            <div class="weather__dayly-day">${time}</div>
            <div class="weather__dayly-icon">
                <img src="icons/weather/${icon}.svg" alt="${icon}">
            </div>
            <div class="weather__dayly-temp">
                ${Math.round(temp)} &deg;C
            </div>
        `
        weatherDays.append(day);
    }

    // lat-56
    // lon-60
    function weatherOfHourDay (lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=42b9a336a38eb7423f252b2cae144b48&lang=ru&units=metric`)
        .then(resp => {
            return resp.json();
        })
        .then(data => {
            let zone = data.timezone;

            moment.locale('ru');
            
            console.log(data)
            data.hourly.shift(0);
            
            data.hourly.forEach(item => {
                let hour = moment(item.dt * 1000).tz(zone).format('HH'),
                    temp = Math.round(item.temp),
                    icon = item.weather[0].icon;

                weatherHourly(hour, icon, temp);
            }) 

            data.daily.shift(0);
            data.daily.forEach(item => {
                let day = moment(item.dt * 1000).tz(zone).format('dddd'),
                    icon = item.weather[0].icon,
                    temp = Math.round(item.temp.day);

                weatherDaily(day, icon, temp)
            }) 

            let slider = tns({
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



        })
    }


    
})

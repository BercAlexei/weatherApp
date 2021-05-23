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
          rootStyle = getComputedStyle(root),
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
    })

    //geolocation
    
    const res = new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(item =>  {            
            resolve(item.coords);
        });
    });

    res.then(({latitude, longitude} = item) => {
        weatherOfCitys(latitude, longitude)
    })

    function weatherOfCitys(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=42b9a336a38eb7423f252b2cae144b48&lang=ru&units=metric`)
            .then((response) => {
                return response.json();
            })
            .then(data => {
                document.querySelector('h1').textContent = data.name;
                document.querySelector('.weather__now-temp').innerHTML = `${Math.round(data.main.temp)} &deg;C `;
                document.querySelector('.weather__now-icon img').setAttribute('src', `icons/weather/${data.weather[0].icon}.svg`);
                document.querySelector('.weather__now-descr-text').textContent = `${data.weather[0].description}`;
                document.querySelector('.weather__now-descr-feel span').innerHTML = `${Math.round(data.main.feels_like)} &deg;C `;
                document.querySelector('.weather__now-descr-wind span').textContent = `${Math.round(data.wind.speed)} `;
            }); 
    }
    
    let city = document.querySelector('#city');
        
    city.addEventListener('change', () => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=42b9a336a38eb7423f252b2cae144b48&lang=ru&units=metric`)
            .then((response) => {
                return response.json();
            })
            .then(data => {
            let lat = data.coord.lat,
                lon = data.coord.lon;
                
                weatherOfCitys(lat, lon);
            
            })
    }) 

    // slider

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

    // getDate and setOptins
    const dateSelect = document.querySelector('#date').childNodes;

	let date = new Date();
    
	dateSelect.forEach(item => {

		item.textContent = date.toLocaleString('ru', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });

        switch(item.textContent) {
            case dateSelect[0].textContent:
                dateSelect[0].text = 'Сегодня';
                break;
            case dateSelect[1].textContent:
                dateSelect[1].text = 'Завтра';
                break;
        }

		date.setDate(date.getDate() + 1);
	});

    console.dir(dateSelect[0])



})

'use strict'

document.addEventListener('DOMContentLoaded', () => {

    //modal
    const modal = document.querySelector('.modal'),
          setting = document.querySelector('.btn_setting'),
          closeModal = document.querySelector('.modal__window-close');

    setting.addEventListener('click', (event) => {
        event.preventDefault();
        modal.classList.add('active');
    });

    closeModal.addEventListener('click', (event) => {
        event.preventDefault();
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape') {
            modal.classList.remove('active')
        }
    });

    //theme

    const root = document.querySelector(':root'),
          rootStyle = getComputedStyle(root),
          darkTheme = document.querySelector('#dark'),
          btnSub = document.querySelector('.btn_submit'),
          radioBtns = document.querySelectorAll('[data-radio]');


    function changeTheme() {
        if (darkTheme.checked) {
            root.style.setProperty('--bg-color', '#323232')
            root.style.setProperty('--window-bg-color', '#535353')
            root.style.setProperty('--text-color', 'white')
            root.style.setProperty('--bottom-color-not-active', '#323232')
        } else {
            root.style.setProperty('--bg-color', '#F1F5FE')
            root.style.setProperty('--window-bg-color', '#ffffff')
            root.style.setProperty('--text-color', 'black')
            root.style.setProperty('--bottom-color-not-active', '#EDEDED')
        }
    }

    if(localStorage.getItem('dark')) {
        darkTheme.checked = true;
    };
    changeTheme();

    radioBtns.forEach(item => {
        item.addEventListener('click', changeTheme);
    });

    btnSub.addEventListener('click', (e) => {
        e.preventDefault()
        
        if(localStorage.getItem('dark')) {
            localStorage.removeItem('dark')
        } else {
            localStorage.setItem('dark', true);
        }
        
        modal.classList.remove('active')
    })
})

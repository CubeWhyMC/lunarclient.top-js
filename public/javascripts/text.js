let navbarItem = document.querySelectorAll('.item')
for (let i = 0; i < navbarItem.length; i++) {
    navbarItem[i].addEventListener('click', function () {
        for (let i = 0; i < navbarItem.length; i++) {
            navbarItem[i].classList.remove('active')
        }
        this.classList.add('active')
    })
}

var typed = new Typed(".multiple-text", {
    strings: ['支持添加JavaAgents', "启动器汉化", "自定义JDK", "完全开源", "自定义启动参数", "支持添加LunarCN Mod", "完全免费", "用爱发电", "离线登录"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
})

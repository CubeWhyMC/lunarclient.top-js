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
    strings: ['JavaAgents support', "own API", "Custom JDK", "Custom JVM args", "Add LunarCN Mod", "Free and open source", "Cracked Account","Free Capes"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
})

export const useMouse = () => {
  if (process.client) {
    const mouse = document.getElementById('mouse') as HTMLDivElement
    const images = document.querySelectorAll('img')
    const home = document.querySelector('[aria-label="Home"]')
    const contentHero = document.querySelectorAll('.content-hero')

    home?.addEventListener('mouseover', () => {
        mouse?.classList.remove('blur-me')
    })

    home?.addEventListener('mouseleave', () => {
        mouse?.classList.remove('blur-me')
    })

    contentHero.forEach((hero) => {
      hero.addEventListener('mouseover', () => {
        mouse.className = ''
      })
      hero.addEventListener('mouseleave', () => {
        mouse.className = 'mouse'
      })
    })

    images.forEach((image) => {
      if (!image.classList.contains('content-hero')) {
        image.addEventListener('mouseover', () => {
          mouse?.classList.add('blur-me')
        })
        image.addEventListener('mouseleave', () => {
          mouse?.classList.remove('blur-me')
        })
      }
    })
  }
}
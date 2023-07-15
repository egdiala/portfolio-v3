export const useMouse = () => {
  if (process.client) {
    const mouse = document.getElementById('mouse')
    const images = document.querySelectorAll('img')
    const home = document.querySelector('[aria-label="Home"]')

    home?.addEventListener('mouseover', () => {
        mouse?.classList.remove('blur-me')
    })

    home?.addEventListener('mouseleave', () => {
        mouse?.classList.remove('blur-me')
    })

    images.forEach((image) => {
      image.addEventListener('mouseover', () => {
        mouse?.classList.add('blur-me')
      })
      image.addEventListener('mouseleave', () => {
        mouse?.classList.remove('blur-me')
      })
    })
  }
}
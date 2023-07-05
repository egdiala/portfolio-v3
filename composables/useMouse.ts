export const useMouse = () => {
  if (process.client) {
    const mouse = document.getElementById('mouse')
    const images = document.querySelectorAll('img')

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
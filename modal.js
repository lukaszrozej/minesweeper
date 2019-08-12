const modal = document.querySelector('.modal')
const openModalBtn = document.querySelector('#open-modal')
const generateBtn = document.querySelector('#generate')

const sliders = document.querySelectorAll('.slider')
const [rowsSlider, colsSlider, probSlider] = sliders

const getSliderValues = () => ({
  rows: rowsSlider.value,
  cols: colsSlider.value,
  prob: probSlider.value
})

const toggleModal = e => {
  e.preventDefault()
  modal.classList.toggle('open')
}

openModalBtn.addEventListener('click', toggleModal)
generateBtn.addEventListener('click', toggleModal)

const valueSetterFor = slider => {
  const id = slider.id + '-span'
  const span = document.getElementById(id)
  return () => { span.textContent = slider.value }
}

sliders.forEach(slider => {
  slider.addEventListener('input', valueSetterFor(slider))
})
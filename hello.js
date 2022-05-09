function qsa(spec){
  return [...document.querySelectorAll(spec)]
}

function qsa(spec){
  return document.querySelector(spec)
}

const iC = {
  qsa(spec){
    return [...document.querySelectorAll(spec)]
  },

  qsa(spec){
    return document.querySelector(spec)
  }
}

module.exports = {
  createSVGMarker: function (color) {
    return `data:image/svg+xml;utf-8,
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" stroke="white" stroke-width="1.5" d="M3.5 3.5h25v25h-25z" ></path>
      </svg>`
  }
}

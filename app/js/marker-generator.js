module.exports = {
  createSVGMarker: function (color) {
    return `data:image/svg+xml;utf-8,
    <svg width="32px" height="32px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: Sketch 40.3 (33839) - http://www.bohemiancoding.com/sketch -->
      <title>MapMarker</title>
      <desc>Created with Sketch.</desc>
      <defs></defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="MapMarker">
          <path d="M16,32 C16,32 28,22 28,12 C28,5.15879536 22.627417,0 16,0 C9.372583,0 4,5.16369176 4,12 C4,22 16,32 16,32 Z M16,19 C19.8659932,19 23,15.8659932 23,12 C23,8.13400675 19.8659932,5 16,5 C12.1340068,5 9,8.13400675 9,12 C9,15.8659932 12.1340068,19 16,19 Z" id="Combined-Shape" fill="${color.pri}"></path>
          <circle stroke="${color.sec}" stroke-width="3" cx="16" cy="11.5" r="6.5"></circle>
        </g>
      </g>
    </svg>`
  }
}

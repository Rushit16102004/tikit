document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const displayCinema = document.getElementById('displayCinema');
  const displayAddress = document.getElementById('displayAddress');
  const displayMovie = document.getElementById('displayMovie');
  const displayDate = document.getElementById('displayDate');
  const displaySeatsInfo = document.getElementById('displaySeatsInfo');
  const displayInvoice = document.getElementById('displayInvoice');
  const displayUser = document.getElementById('displayUser');
  const displayWorkstation = document.getElementById('displayWorkstation');
  const displayBookingId = document.getElementById('displayBookingId');
  const displayTotalPaid = document.getElementById('displayTotalPaid');

  const displayNetCharge = document.getElementById('displayNetCharge');
  const displayCgst = document.getElementById('displayCgst');
  const displaySgst = document.getElementById('displaySgst');
  const displaySc = document.getElementById('displaySc');
  const displayTicketCost = document.getElementById('displayTicketCost');
  const displayCountVal = document.getElementById('displayCountVal');

  // Load Config (Default to TICKET_CONFIG defined in config.js)
  function getConfig() {
    const params = new URLSearchParams(window.location.search);
    const cfg = (typeof TICKET_CONFIG !== 'undefined') ? { ...TICKET_CONFIG } : {};

    if (params.has('movie')) cfg.movieName = params.get('movie');
    if (params.has('cinema')) cfg.cinema = params.get('cinema');
    if (params.has('address')) cfg.cinemaAddress = params.get('address');
    if (params.has('date')) cfg.date = params.get('date');
    if (params.has('time')) cfg.time = params.get('time');
    if (params.has('screen')) cfg.screen = params.get('screen');
    if (params.has('class')) cfg.ticketClass = params.get('class');
    if (params.has('tickets')) cfg.ticketCount = parseInt(params.get('tickets')) || 1;
    if (params.has('price')) cfg.ticketPrice = parseFloat(params.get('price')) || 0;
    if (params.has('seats')) cfg.seats = params.get('seats');
    if (params.has('invoice')) cfg.invoiceNo = params.get('invoice');
    if (params.has('userId')) cfg.userId = params.get('userId');
    if (params.has('workstation')) cfg.workstation = params.get('workstation');
    if (params.has('bookingId')) cfg.bookingId = params.get('bookingId');

    return cfg;
  }

  function renderTicket() {
    const cfg = getConfig();

    const movieName = cfg.movieName || 'TOXIC - HINDI (A)';
    const cinema = cfg.cinema || 'Rajhans Cinemas - Katargam';
    const address = cfg.cinemaAddress || 'Rajhans Flamingo Mall, Ambatalavadi, Katargam, Surat, Gujarat 395004, India';
    const dateVal = cfg.date || '2026-08-28';
    const timeVal = cfg.time || '22:30';
    const screenNum = cfg.screen || '1';
    const ticketClass = cfg.ticketClass || 'EXECUTIVE';

    let count = parseInt(cfg.ticketCount) || 1;
    if (count < 1) count = 1;

    let singlePrice = parseFloat(cfg.ticketPrice) || 340;
    if (singlePrice < 0) singlePrice = 0;

    // Automatic Price Calculation (Count * Single Price)
    const totalAmount = count * singlePrice;

    const seats = cfg.seats || `${ticketClass} C-10, C-11`;
    const invoiceNo = cfg.invoiceNo || '01003013';
    const userId = cfg.userId || '1303';
    const workstation = cfg.workstation || 'HORAJPC529';
    const bookingId = cfg.bookingId || 'T18 0000000001700366';

    // Format Date & Time
    let dateStr = dateVal;
    try {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = days[d.getDay()];
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        dateStr = `${dayName} ${dd}/${mm}/${yyyy}`;
      }
    } catch (e) {}

    let timeStr = timeVal;
    try {
      const [h, m] = timeVal.split(':');
      if (h !== undefined && m !== undefined) {
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const h12 = hour % 12 || 12;
        timeStr = `${h12.toString().padStart(2, '0')}:${m} ${ampm}`;
      }
    } catch (e) {}

    // Cost Breakup Calculations
    const scAmount = Math.round(totalAmount * 0.0623 * 100) / 100;
    const remaining = totalAmount - scAmount;
    const netCharge = Math.round((remaining / 1.18) * 100) / 100;
    const totalGst = remaining - netCharge;
    const cgst = Math.round((totalGst / 2) * 100) / 100;
    const sgst = Math.round((totalGst / 2) * 100) / 100;

    // DOM Updates
    displayCinema.textContent = cinema;
    displayAddress.textContent = address;
    displayMovie.textContent = movieName;
    displayDate.textContent = `${dateStr} | ${timeStr}`;
    displaySeatsInfo.textContent = `Screen: ${screenNum} | ${count} Seats | ${seats}`;
    displayInvoice.textContent = invoiceNo;
    displayUser.textContent = userId;
    displayWorkstation.textContent = workstation;
    displayBookingId.textContent = `Booking ID - ${bookingId}`;

    const formattedTotal = `₹${totalAmount.toFixed(2)}`;
    displayTotalPaid.textContent = formattedTotal;

    displayNetCharge.textContent = `₹${netCharge.toFixed(2)}`;
    displayCgst.textContent = `₹${cgst.toFixed(2)}`;
    displaySgst.textContent = `₹${sgst.toFixed(2)}`;
    displaySc.textContent = `₹${scAmount.toFixed(2)}`;
    displayTicketCost.textContent = formattedTotal;
    displayCountVal.textContent = `x ${count}`;

    // Render Dynamic QR Code
    updateQRCode({
      bookingId,
      movie: movieName,
      date: dateVal,
      time: timeVal,
      seats,
      count,
      total: totalAmount
    });
  }

  function updateQRCode(data) {
    const qrContainer = document.getElementById('qrCodeContainer');
    if (!qrContainer) return;
    qrContainer.innerHTML = '';

    const payload = JSON.stringify(data);
    if (typeof QRCode !== 'undefined') {
      new QRCode(qrContainer, {
        text: payload,
        width: 150,
        height: 150,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    }
  }

  renderTicket();
});

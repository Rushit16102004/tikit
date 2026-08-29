document.addEventListener('DOMContentLoaded', () => {
  // Input Elements
  const movieNameInput = document.getElementById('movieName');
  const cinemaSelect = document.getElementById('cinema');
  const cinemaAddressInput = document.getElementById('cinemaAddress');
  const dateInput = document.getElementById('date');
  const timeInput = document.getElementById('time');
  const screenInput = document.getElementById('screen');
  const ticketClassSelect = document.getElementById('ticketClass');
  const ticketCountInput = document.getElementById('ticketCount');
  const ticketPriceInput = document.getElementById('ticketPrice');
  const seatsInput = document.getElementById('seats');
  const invoiceNoInput = document.getElementById('invoiceNo');
  const userIdInput = document.getElementById('userId');
  const workstationInput = document.getElementById('workstation');
  const bookingIdInput = document.getElementById('bookingId');

  // Preview Display Elements
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
  const formTotalPrice = document.getElementById('formTotalPrice');

  // Breakup Elements
  const displayNetCharge = document.getElementById('displayNetCharge');
  const displayCgst = document.getElementById('displayCgst');
  const displaySgst = document.getElementById('displaySgst');
  const displaySc = document.getElementById('displaySc');
  const displayTicketCost = document.getElementById('displayTicketCost');
  const displayCountVal = document.getElementById('displayCountVal');

  // Buttons & Modal
  const btnShareLink = document.getElementById('btnShareLink');
  const btnPrint = document.getElementById('btnPrint');
  const btnRandomizeId = document.getElementById('btnRandomizeId');
  const shareModal = document.getElementById('shareModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const shareUrlInput = document.getElementById('shareUrlInput');
  const btnCopyUrl = document.getElementById('btnCopyUrl');

  let qrCodeInstance = null;

  // Generate random digits helper
  function randomDigits(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }

  function randomizeIds() {
    invoiceNoInput.value = '01' + randomDigits(6);
    userIdInput.value = Math.floor(1000 + Math.random() * 9000).toString();
    workstationInput.value = 'HORAJPC' + Math.floor(100 + Math.random() * 900);
    bookingIdInput.value = 'T18 ' + randomDigits(16);
  }

  // Update All Ticket Details & Calculations
  function updateTicket() {
    const movieName = movieNameInput.value.trim() || 'TOXIC - HINDI (A)';
    const cinema = cinemaSelect.value || 'Rajhans Cinemas - Katargam';
    const address = cinemaAddressInput.value.trim() || 'Rajhans Flamingo Mall, Ambatalavadi, Katargam, Surat, Gujarat 395004, India';
    const dateVal = dateInput.value || new Date().toISOString().split('T')[0];
    const timeVal = timeInput.value || '22:30';
    const screenNum = screenInput.value || '1';
    const ticketClass = ticketClassSelect.value || 'EXECUTIVE';
    
    let count = parseInt(ticketCountInput.value) || 1;
    if (count < 1) count = 1;

    let singlePrice = parseFloat(ticketPriceInput.value) || 340;
    if (singlePrice < 0) singlePrice = 0;

    // Total Calculation (Tickets * Single Price)
    const totalAmount = count * singlePrice;

    const seats = seatsInput.value.trim() || `${ticketClass} C-10, C-11`;
    const invoiceNo = invoiceNoInput.value.trim() || '01003013';
    const userId = userIdInput.value.trim() || '1303';
    const workstation = workstationInput.value.trim() || 'HORAJPC529';
    const bookingId = bookingIdInput.value.trim() || 'T18 0000000001700366';

    // Format Date & Time cleanly (e.g. Fri 28/08/2026 | 10:30 pm)
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

    // Domestic Tax Breakup Math (~18% GST & Service Charge breakdown)
    const scAmount = Math.round(totalAmount * 0.0623 * 100) / 100; // Convenience SC
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
    formTotalPrice.textContent = formattedTotal;

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

  // QR Code Renderer
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

  // URL Query Parameters Support
  function loadFromUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('movie')) movieNameInput.value = params.get('movie');
    if (params.has('cinema')) cinemaSelect.value = params.get('cinema');
    if (params.has('address')) cinemaAddressInput.value = params.get('address');
    if (params.has('date')) dateInput.value = params.get('date');
    if (params.has('time')) timeInput.value = params.get('time');
    if (params.has('screen')) screenInput.value = params.get('screen');
    if (params.has('class')) ticketClassSelect.value = params.get('class');
    if (params.has('tickets')) ticketCountInput.value = params.get('tickets');
    if (params.has('price')) ticketPriceInput.value = params.get('price');
    if (params.has('seats')) seatsInput.value = params.get('seats');
    if (params.has('invoice')) invoiceNoInput.value = params.get('invoice');
    if (params.has('userId')) userIdInput.value = params.get('userId');
    if (params.has('workstation')) workstationInput.value = params.get('workstation');
    if (params.has('bookingId')) bookingIdInput.value = params.get('bookingId');
  }

  // Build Shareable Link URL
  function buildShareableUrl() {
    const baseUrl = `${window.location.origin}/ticket`;
    const params = new URLSearchParams({
      movie: movieNameInput.value,
      cinema: cinemaSelect.value,
      address: cinemaAddressInput.value,
      date: dateInput.value,
      time: timeInput.value,
      screen: screenInput.value,
      class: ticketClassSelect.value,
      tickets: ticketCountInput.value,
      price: ticketPriceInput.value,
      seats: seatsInput.value,
      invoice: invoiceNoInput.value,
      userId: userIdInput.value,
      workstation: workstationInput.value,
      bookingId: bookingIdInput.value
    });
    return `${baseUrl}?${params.toString()}`;
  }

  // Event Listeners
  const allInputs = [
    movieNameInput, cinemaSelect, cinemaAddressInput, dateInput, timeInput,
    screenInput, ticketClassSelect, ticketCountInput, ticketPriceInput,
    seatsInput, invoiceNoInput, userIdInput, workstationInput, bookingIdInput
  ];

  allInputs.forEach(el => {
    if (el) {
      el.addEventListener('input', updateTicket);
      el.addEventListener('change', updateTicket);
    }
  });

  if (btnRandomizeId) {
    btnRandomizeId.addEventListener('click', () => {
      randomizeIds();
      updateTicket();
    });
  }

  if (btnShareLink) {
    btnShareLink.addEventListener('click', () => {
      shareUrlInput.value = buildShareableUrl();
      shareModal.classList.add('active');
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      shareModal.classList.remove('active');
    });
  }

  if (btnCopyUrl) {
    btnCopyUrl.addEventListener('click', () => {
      shareUrlInput.select();
      navigator.clipboard.writeText(shareUrlInput.value).then(() => {
        const orig = btnCopyUrl.innerHTML;
        btnCopyUrl.innerHTML = '✅ Copied!';
        setTimeout(() => { btnCopyUrl.innerHTML = orig; }, 2000);
      });
    });
  }

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // Init
  loadFromUrlParams();
  if (!dateInput.value) dateInput.value = new Date().toISOString().split('T')[0];
  updateTicket();
});

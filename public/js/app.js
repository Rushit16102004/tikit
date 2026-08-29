document.addEventListener('DOMContentLoaded', () => {
  const PIN_CODE = '123123'; // Developer PIN

  // Display Elements
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

  // Developer Elements & Modals
  const devSecretBtn = document.getElementById('devSecretBtn');
  const logoDevTrigger = document.getElementById('logoDevTrigger');
  const pinModal = document.getElementById('pinModal');
  const closePinModal = document.getElementById('closePinModal');
  const pinInput = document.getElementById('pinInput');
  const pinErrorMsg = document.getElementById('pinErrorMsg');
  const btnVerifyPin = document.getElementById('btnVerifyPin');

  const devConfigModal = document.getElementById('devConfigModal');
  const closeConfigModal = document.getElementById('closeConfigModal');

  // Developer Inputs
  const devMovie = document.getElementById('devMovie');
  const devDate = document.getElementById('devDate');
  const devTime = document.getElementById('devTime');
  const devTicketCount = document.getElementById('devTicketCount');
  const devTicketPrice = document.getElementById('devTicketPrice');
  const devCinema = document.getElementById('devCinema');
  const devScreen = document.getElementById('devScreen');
  const devSeats = document.getElementById('devSeats');
  const devBookingId = document.getElementById('devBookingId');
  const devInvoiceNo = document.getElementById('devInvoiceNo');
  const devTotalPreview = document.getElementById('devTotalPreview');

  const btnSaveConfig = document.getElementById('btnSaveConfig');
  const btnResetConfig = document.getElementById('btnResetConfig');

  // Helper: Auto-generate seat numbers array based on count (e.g., EXECUTIVE C-10, C-11, C-12)
  function generateSeatsForCount(count) {
    const list = [];
    const startNum = 10;
    for (let i = 0; i < count; i++) {
      const seatNum = startNum + i;
      if (i === 0) {
        list.push(`EXECUTIVE C-${seatNum}`);
      } else {
        list.push(`C-${seatNum}`);
      }
    }
    return list.join(', ');
  }

  // Active Ticket Configuration state
  let currentConfig = {};

  // Load Config (Priority: localStorage > URL params > config.js)
  function loadConfig() {
    let cfg = (typeof TICKET_CONFIG !== 'undefined') ? { ...TICKET_CONFIG } : {};

    // Check localStorage
    const saved = localStorage.getItem('developer_ticket_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        cfg = { ...cfg, ...parsed };
      } catch (e) {}
    }

    // Check URL params
    const params = new URLSearchParams(window.location.search);
    if (params.has('movie')) cfg.movieName = params.get('movie');
    if (params.has('cinema')) cfg.cinema = params.get('cinema');
    if (params.has('date')) cfg.date = params.get('date');
    if (params.has('time')) cfg.time = params.get('time');
    if (params.has('tickets')) cfg.ticketCount = parseInt(params.get('tickets')) || 1;
    if (params.has('price')) cfg.ticketPrice = parseFloat(params.get('price')) || 0;
    if (params.has('seats')) cfg.seats = params.get('seats');
    if (params.has('bookingId')) cfg.bookingId = params.get('bookingId');

    currentConfig = cfg;
    return cfg;
  }

  function renderTicket() {
    const cfg = loadConfig();

    const movieName = cfg.movieName || 'SPIDER-MAN - HINDI (UA)';
    const cinema = cfg.cinema || 'Rajhans Cinemas - Katargam';
    const address = cfg.cinemaAddress || 'Rajhans Flamingo Mall, Ambatalavadi, Katargam, Surat, Gujarat 395004, India';
    const dateVal = cfg.date || '2026-08-29';
    const timeVal = cfg.time || '14:30';
    const screenNum = cfg.screen || '1';

    let count = parseInt(cfg.ticketCount) || 1;
    if (count < 1) count = 1;

    let singlePrice = parseFloat(cfg.ticketPrice) || 280;
    if (singlePrice < 0) singlePrice = 0;

    // Total Calculation (Tickets * Price)
    const totalAmount = count * singlePrice;

    // Seats auto-sync: If seats not specified or doesn't match count format, auto generate seats
    let seats = cfg.seats;
    if (!seats) {
      seats = generateSeatsForCount(count);
    }

    const invoiceNo = cfg.invoiceNo || '01003014';
    const userId = cfg.userId || '1303';
    const workstation = cfg.workstation || 'HORAJPC529';
    const bookingId = cfg.bookingId || 'T18 0000000001700367';

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

    // Tax Breakup
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

  // Developer PIN Authentication
  function openPinModal() {
    pinInput.value = '';
    pinErrorMsg.style.display = 'none';
    pinModal.classList.add('active');
    setTimeout(() => pinInput.focus(), 100);
  }

  function verifyPin() {
    if (pinInput.value.trim() === PIN_CODE) {
      pinModal.classList.remove('active');
      openDevConfigModal();
    } else {
      pinErrorMsg.style.display = 'block';
    }
  }

  // Developer Config Editor Modal
  function openDevConfigModal() {
    const cfg = currentConfig;
    devMovie.value = cfg.movieName || '';
    devDate.value = cfg.date || '';
    devTime.value = cfg.time || '';
    devTicketCount.value = cfg.ticketCount || 3;
    devTicketPrice.value = cfg.ticketPrice || 280;
    devCinema.value = cfg.cinema || '';
    devScreen.value = cfg.screen || '1';
    
    // Auto-update seat input if empty or matching count
    const count = parseInt(devTicketCount.value) || 3;
    devSeats.value = cfg.seats || generateSeatsForCount(count);

    devBookingId.value = cfg.bookingId || '';
    devInvoiceNo.value = cfg.invoiceNo || '';

    updateDevTotalPreview();
    devConfigModal.classList.add('active');
  }

  function updateDevTotalPreview() {
    const count = parseInt(devTicketCount.value) || 1;
    const price = parseFloat(devTicketPrice.value) || 0;

    // Auto update seat list input when developer changes ticket count
    devSeats.value = generateSeatsForCount(count);

    devTotalPreview.textContent = `₹${(count * price).toFixed(2)}`;
  }

  function saveDevConfig() {
    const updated = {
      movieName: devMovie.value.trim(),
      date: devDate.value,
      time: devTime.value,
      ticketCount: parseInt(devTicketCount.value) || 1,
      ticketPrice: parseFloat(devTicketPrice.value) || 0,
      cinema: devCinema.value.trim(),
      screen: devScreen.value.trim(),
      seats: devSeats.value.trim(),
      bookingId: devBookingId.value.trim(),
      invoiceNo: devInvoiceNo.value.trim()
    };

    localStorage.setItem('developer_ticket_config', JSON.stringify(updated));
    devConfigModal.classList.remove('active');
    renderTicket();
  }

  function resetDevConfig() {
    localStorage.removeItem('developer_ticket_config');
    devConfigModal.classList.remove('active');
    renderTicket();
  }

  // Event Listeners for Developer Mode
  if (devSecretBtn) devSecretBtn.addEventListener('click', openPinModal);
  if (logoDevTrigger) logoDevTrigger.addEventListener('click', openPinModal);
  if (closePinModal) closePinModal.addEventListener('click', () => pinModal.classList.remove('active'));
  if (btnVerifyPin) btnVerifyPin.addEventListener('click', verifyPin);
  
  pinInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') verifyPin();
  });

  if (closeConfigModal) closeConfigModal.addEventListener('click', () => devConfigModal.classList.remove('active'));
  if (btnSaveConfig) btnSaveConfig.addEventListener('click', saveDevConfig);
  if (btnResetConfig) btnResetConfig.addEventListener('click', resetDevConfig);

  devTicketCount.addEventListener('input', updateDevTotalPreview);
  devTicketCount.addEventListener('change', updateDevTotalPreview);
  devTicketPrice.addEventListener('input', updateDevTotalPreview);

  // Initial Render
  renderTicket();
});

/**
 * منصة حفظ النعمة - منطق التشغيل والتفاعل وإدارة البيانات (الإصدار المطور)
 * "نحفظ النعمة ... و نصنع منها قيمة"
 */

// Initial Seed Data if not present in localStorage
const DEFAULT_DATA = {
  wallet: {
    points: 420,
    totalKgDonated: 34.5,
    co2SavedKg: 86.25,
    ordersCount: 5,
    cashEarnings: 0
  },
  drivers: [
    { id: 'DRV-1', name: 'كابتن أحمد سامي', phone: '01011122233', vehicle: 'تروسيكل مجهز صديق للبيئة' },
    { id: 'DRV-2', name: 'كابتن محمود علي', phone: '01122233344', vehicle: 'فان نقل مخصصة' },
    { id: 'DRV-3', name: 'كابتن حسن السيد', phone: '01233344455', vehicle: 'سكوتر كهربائي للنقل الخفيف' }
  ],
  orders: [
    {
      id: 'REQ-1082',
      householdName: 'عائلة أحمد الشناوي',
      phone: '01012345678',
      address: 'عمارة النور - شقة 4 - حي الزهور',
      type: 'صالح للاستهلاك الآدمي',
      category: 'وجبات مطبوخة ومخبوزات مغلفة',
      estimatedKg: 4.5,
      timeSlot: 'اليوم (6:00 م - 8:00 م)',
      notes: 'وجبات عشاء مغلفة ونظيفة بحالة ممتازة',
      status: 'assigned', // pending, assigned, en_route, collected, sorted
      driverId: 'DRV-1',
      driverName: 'كابتن أحمد سامي',
      createdAt: '2026-08-31 18:30',
      destinationStream: null,
      actualKg: null,
      pointsEarned: 0
    },
    {
      id: 'REQ-1081',
      householdName: 'أسرة د. محمود عبد العزيز',
      phone: '01123456789',
      address: 'شارع السلام - عمارة 12 - شقة 8',
      type: 'مخلفات عضوية للتدوير',
      category: 'قشور خضار وفواكه وبقايا أرز',
      estimatedKg: 8.0,
      timeSlot: 'اليوم (4:00 م - 6:00 م)',
      notes: 'مفروزة في أكياس مخصصة',
      status: 'collected',
      driverId: 'DRV-2',
      driverName: 'كابتن محمود علي',
      createdAt: '2026-08-31 14:15',
      destinationStream: null,
      actualKg: null,
      pointsEarned: 0
    },
    {
      id: 'REQ-1080',
      householdName: 'أسرة م. طارق فاروق',
      phone: '01234567890',
      address: 'مربع الفردوس - عمارة 3 - شقة 1',
      type: 'مخلفات عضوية للتدوير',
      category: 'خبز يابس وبقايا حبوب وبقوليات',
      estimatedKg: 6.0,
      timeSlot: 'أمس (10:00 ص - 12:00 م)',
      notes: 'جاهز لأعلاف الطيور',
      status: 'sorted',
      driverId: 'DRV-1',
      driverName: 'كابتن أحمد سامي',
      createdAt: '2026-08-30 09:30',
      destinationStream: 'stream-2', // أعلاف الدواجن والطيور
      actualKg: 6.2,
      pointsEarned: 74
    },
    {
      id: 'REQ-1079',
      householdName: 'أسرة الحاج إبراهيم',
      phone: '01098765432',
      address: 'شارع مكة - عمارة 7 - شقة 5',
      type: 'مخلفات عضوية للتدوير',
      category: 'قشور فواكه وخضروات ومخلفات مطبخ',
      estimatedKg: 12.0,
      timeSlot: 'أمس (2:00 م - 4:00 م)',
      notes: 'مفروزة ونقية جداً',
      status: 'sorted',
      driverId: 'DRV-3',
      driverName: 'كابتن حسن السيد',
      createdAt: '2026-08-30 11:00',
      destinationStream: 'stream-3', // سماد الكمبوست
      actualKg: 12.5,
      pointsEarned: 150
    }
  ],
  supplyOrders: [
    {
      id: 'SUP-501',
      projectName: 'مزرعة النور للإنتاج الداجني (مشروع شباب)',
      ownerName: 'م. أحمد ممدوح',
      phone: '01023456789',
      streamKey: 'stream2',
      streamName: 'مدخلات أعلاف الدواجن والطيور',
      requestedKg: 120,
      status: 'pending', // pending, approved, dispatched
      notes: 'توريد أسبوعي دوري للأعلاف',
      createdAt: '2026-08-31 16:30'
    },
    {
      id: 'SUP-500',
      projectName: 'مشاتل الواحة الخضراء لإنتاج الكمبوست',
      ownerName: 'د. سارة عثمان',
      phone: '01198765432',
      streamKey: 'stream3',
      streamName: 'المادة الخام لإنتاج الكمبوست',
      requestedKg: 250,
      status: 'dispatched',
      notes: 'تم استلام الدفعة بنجاح',
      createdAt: '2026-08-30 10:15'
    }
  ],
  inventory: {
    stream1: { name: 'الصالح للاستهلاك (ثلاجة الخير)', kg: 45, unit: 'كجم' },
    stream2: { name: 'مدخلات أعلاف الدواجن والطيور', kg: 380, unit: 'كجم' },
    stream3: { name: 'المادة الخام لإنتاج الكمبوست', kg: 620, unit: 'كجم' },
    stream4: { name: 'كتلة عضوية مهيأة للغاز الحيوي', kg: 240, unit: 'كجم' },
    stream5: { name: 'ركائز تربية يرقات الجندي الأسود (BSF)', kg: 190, unit: 'كجم' }
  },
  cashOptions: [
    { id: 'CASH-1', title: 'كاش فوري فودافون كاش / محافظ إلكترونية', cashAmount: 30, pointsCost: 200, icon: 'fa-money-bill-wave', badge: 'فوري' },
    { id: 'CASH-2', title: 'تحويل كاش إنستاباي InstaPay', cashAmount: 75, pointsCost: 450, icon: 'fa-building-columns', badge: 'الأكثر طلباً' },
    { id: 'CASH-3', title: 'كارت شحن رصيد (فودافون / اتصالات / أورنج / وي)', cashAmount: 20, pointsCost: 150, icon: 'fa-mobile-screen-button', badge: 'شحن فوري' },
    { id: 'CASH-4', title: 'كاش فوري تحويل بنكي / محفظة ذكية', cashAmount: 150, pointsCost: 850, icon: 'fa-sack-dollar', badge: 'قيمة كبرى' }
  ],
  coupons: [
    {
      id: 'CPN-1',
      store: 'سوبرماركت كازيون & خير زمان',
      discount: 'خصم 50 جنيه',
      minSpend: 'عند الشراء بقيمة 250 جنيه',
      pointsCost: 150,
      icon: 'fa-shopping-cart',
      category: 'سوبرماركت',
      code: 'KAZYON-GREEN-50',
      claimed: false
    },
    {
      id: 'CPN-2',
      store: 'مخابز وحلواني العبد',
      discount: 'خصم 25% على المخبوزات الطازجة',
      minSpend: 'بحد أقصى للخصم 40 جنيه',
      pointsCost: 120,
      icon: 'fa-bread-slice',
      category: 'مخابز',
      code: 'ABD-ECO-25',
      claimed: false
    },
    {
      id: 'CPN-3',
      store: 'سلسلة هايبر وان',
      discount: 'قسيمة مشتريات بقيمة 100 جنيه',
      minSpend: 'على مشتريات الخضار والفواكه',
      pointsCost: 280,
      icon: 'fa-store',
      category: 'سوبرماركت',
      code: 'HYPER1-SAVE-100',
      claimed: false
    },
    {
      id: 'CPN-4',
      store: 'أسواق فتح الله ماركت',
      discount: 'خصم 15% على إجمالي الفاتورة',
      minSpend: 'صالحة طوال الشهر',
      pointsCost: 180,
      icon: 'fa-basket-shopping',
      category: 'سوبرماركت',
      code: 'FATHALLA-CIRCULAR-15',
      claimed: false
    }
  ],
  myClaimedCoupons: [],
  myCashTransactions: [],
  nationalStats: {
    totalKgDiverted: 1475,
    totalCO2SavedTon: 3.68,
    totalMethaneReducedKg: 663,
    activeFamiliesCount: 142,
    youthJobsCreated: 18,
    womenJobsCreated: 12,
    supportedEnterprises: 9,
    totalSupplyKgToBusinesses: 680
  },
  locations: [
    {
      id: 'hub-1',
      name: 'مركز التجميع والفرز الرئيسي (الوحدة المحلية)',
      type: 'center',
      lat: 30.0444,
      lng: 31.2357,
      desc: 'مساحة 25م² لاستقبال وفرز المخلفات العضوية يومياً من 8 ص إلى 8 م'
    },
    {
      id: 'fridge-1',
      name: 'ثلاجة الخير (1) - مدخل مجمع الأمل السكني',
      type: 'fridge',
      lat: 30.0490,
      lng: 31.2390,
      desc: 'مخصصة للوجبات المطبوخة والمغلفة النظيفة للاستخدام الآدمي المباشر'
    },
    {
      id: 'fridge-2',
      name: 'ثلاجة الخير (2) - بجوار المسجد الكبير',
      type: 'fridge',
      lat: 30.0410,
      lng: 31.2310,
      desc: 'مراقبة ومكيفة بانتظام مع سجل تاريخ الصلاحية'
    },
    {
      id: 'partner-1',
      name: 'سوبرماركت كازيون (فرع الزهور)',
      type: 'partner',
      lat: 30.0465,
      lng: 31.2420,
      desc: 'يقبل استبدال كوبونات وقسائم خصم منصة حفظ النعمة'
    },
    {
      id: 'partner-2',
      name: 'مخبز وحلواني العبد',
      type: 'partner',
      lat: 30.0395,
      lng: 31.2380,
      desc: 'شريك في تقديم خصومات ومكافآت للمشاركين'
    }
  ]
};

// Application State
class AppState {
  constructor() {
    this.loadState();
  }

  loadState() {
    const saved = localStorage.getItem('hefz_ne3ma_state_v2');
    if (saved) {
      try {
        this.data = JSON.parse(saved);
        if (!this.data.supplyOrders) this.data.supplyOrders = DEFAULT_DATA.supplyOrders;
        if (!this.data.cashOptions) this.data.cashOptions = DEFAULT_DATA.cashOptions;
        if (!this.data.myCashTransactions) this.data.myCashTransactions = [];
        if (!this.data.drivers) this.data.drivers = DEFAULT_DATA.drivers;
      } catch (e) {
        console.error('Error loading state, using defaults', e);
        this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      }
    } else {
      this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      this.saveState();
    }
  }

  saveState() {
    localStorage.setItem('hefz_ne3ma_state_v2', JSON.stringify(this.data));
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this.saveState();
    location.reload();
  }
}

const state = new AppState();

// Global Variables
let mapInstance = null;
let streamChartInstance = null;
let monthlyChartInstance = null;

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initRoleNavigation();
  initEcoCalculator();
  initDonationForm();
  initSortingStation();
  initMarketplace();
  initCashConversion();
  renderWalletAndRewards();
  renderOrders();
  renderSupplyOrders();
  renderInventory();
  renderNationalStats();
  initLeafletMap();
  initCharts();
});

/* ---------------------------------------------------------
   1. Role Navigation & Tab Switcher
   --------------------------------------------------------- */
function initRoleNavigation() {
  const pills = document.querySelectorAll('.role-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetRole = pill.getAttribute('data-role');
      switchRole(targetRole);
    });
  });
}

function switchRole(roleId) {
  // Update Pills
  document.querySelectorAll('.role-pill').forEach(p => {
    if (p.getAttribute('data-role') === roleId) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });

  // Update Sections
  const sections = ['overview', 'household', 'center', 'business', 'green-initiative'];
  sections.forEach(sec => {
    const el = document.getElementById(`section-${sec}`);
    if (el) {
      if (sec === roleId) {
        el.classList.remove('hidden');
        el.classList.add('fade-in');
      } else {
        el.classList.add('hidden');
        el.classList.remove('fade-in');
      }
    }
  });

  // Re-render components that might need resizing
  if (roleId === 'overview' || roleId === 'household') {
    setTimeout(() => {
      if (mapInstance) mapInstance.invalidateSize();
    }, 200);
  }
  if (roleId === 'green-initiative') {
    setTimeout(() => {
      renderCharts();
    }, 200);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------------------------------------------------------
   2. Real-time Carbon & Eco Impact Calculator
   --------------------------------------------------------- */
function initEcoCalculator() {
  const slider = document.getElementById('calc-kg-slider');
  const numberInput = document.getElementById('calc-kg-input');

  if (!slider) return;

  function updateCalc(val) {
    const kg = parseFloat(val) || 0;
    if (slider) slider.value = kg;
    if (numberInput) numberInput.value = kg;

    const co2 = (kg * 2.5).toFixed(1);
    const methane = (kg * 0.45).toFixed(2);
    const water = Math.round(kg * 320);
    const points = Math.round(kg * 12);

    const elCo2 = document.getElementById('calc-res-co2');
    const elMethane = document.getElementById('calc-res-methane');
    const elWater = document.getElementById('calc-res-water');
    const elPoints = document.getElementById('calc-res-points');

    if (elCo2) elCo2.textContent = `${co2} كجم`;
    if (elMethane) elMethane.textContent = `${methane} كجم`;
    if (elWater) elWater.textContent = `${water.toLocaleString('ar-EG')} لتر`;
    if (elPoints) elPoints.textContent = `+${points} نقطة`;
  }

  slider.addEventListener('input', (e) => updateCalc(e.target.value));
  if (numberInput) {
    numberInput.addEventListener('input', (e) => updateCalc(e.target.value));
  }

  updateCalc(15);
}

/* ---------------------------------------------------------
   3. Household Donation Submission
   --------------------------------------------------------- */
function initDonationForm() {
  const form = document.getElementById('donation-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('don-name').value.trim() || 'أسرة كريمة';
    const phone = document.getElementById('don-phone').value.trim() || '01000000000';
    const address = document.getElementById('don-address').value.trim();
    const type = document.querySelector('input[name="don-type"]:checked')?.value || 'مخلفات عضوية للتدوير';
    const category = document.getElementById('don-category').value;
    const kg = parseFloat(document.getElementById('don-kg').value) || 3.5;
    const timeSlot = document.getElementById('don-slot').value;
    const notes = document.getElementById('don-notes').value.trim();

    if (!address) {
      showToast('يرجى كتابة العنوان ورقم العمارة والشقة', 'error');
      return;
    }

    const newId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newId,
      householdName: name,
      phone: phone,
      address: address,
      type: type,
      category: category,
      estimatedKg: kg,
      timeSlot: timeSlot,
      notes: notes || 'بدون ملاحظات إضافية',
      status: 'pending',
      driverId: null,
      driverName: null,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      destinationStream: null,
      actualKg: null,
      pointsEarned: 0
    };

    state.data.orders.unshift(newOrder);
    state.saveState();

    form.reset();
    closeModal('donation-modal');

    renderOrders();
    renderNationalStats();
    triggerConfetti();

    showWhatsAppNotificationModal(
      phone,
      name,
      newId,
      `تم استلام طلبكم رقم (${newId}) بنجاح! فريق منصة "حفظ النعمة" سيقوم بالتواصل معكم في الموعد المحدد (${timeSlot}) لجمع الفائض وإضافة النقاط لمحفظتكم.`
    );
  });
}

/* ---------------------------------------------------------
   4. Collection & Sorting Station Logic + Driver Dispatch
   --------------------------------------------------------- */
function initSortingStation() {
  const form = document.getElementById('sorting-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const orderId = document.getElementById('sort-order-select').value;
    const actualKg = parseFloat(document.getElementById('sort-actual-kg').value) || 0;
    const purityRate = document.getElementById('sort-purity-rate').value; // 'A', 'B', 'C'
    const stream = document.getElementById('sort-stream-select').value;

    if (!orderId) {
      showToast('يرجى اختيار الطلب المراد فرزه ووزنه', 'error');
      return;
    }

    if (actualKg <= 0) {
      showToast('يرجى إدخال وزن صحيح', 'error');
      return;
    }

    const orderIndex = state.data.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;

    const order = state.data.orders[orderIndex];

    let points = Math.round(actualKg * 10);
    if (purityRate === 'A') points = Math.round(points * 1.3);
    if (purityRate === 'B') points = Math.round(points * 1.1);

    order.status = 'sorted';
    order.actualKg = actualKg;
    order.destinationStream = stream;
    order.pointsEarned = points;

    if (stream === 'stream-1') state.data.inventory.stream1.kg += actualKg;
    if (stream === 'stream-2') state.data.inventory.stream2.kg += actualKg;
    if (stream === 'stream-3') state.data.inventory.stream3.kg += actualKg;
    if (stream === 'stream-4') state.data.inventory.stream4.kg += actualKg;
    if (stream === 'stream-5') state.data.inventory.stream5.kg += actualKg;

    state.data.wallet.points += points;
    state.data.wallet.totalKgDonated += actualKg;
    state.data.wallet.co2SavedKg += actualKg * 2.5;

    state.data.nationalStats.totalKgDiverted += actualKg;
    state.data.nationalStats.totalCO2SavedTon = parseFloat((state.data.nationalStats.totalKgDiverted * 0.0025).toFixed(2));
    state.data.nationalStats.totalMethaneReducedKg = Math.round(state.data.nationalStats.totalKgDiverted * 0.45);

    state.saveState();

    form.reset();
    showToast(`تم وزن وفرز الطلب ${orderId} وتوجيهه إلى المخزون وإضافة +${points} نقطة للأسرة!`, 'success');

    // Trigger WhatsApp notification for sorting completion
    showWhatsAppNotificationModal(
      order.phone,
      order.householdName,
      order.id,
      `مبروك! تم وزن وفرز شحنة طعامكم (${actualKg} كجم) وتوجيهها بنجاح إلى (${getStreamLabel(stream)}). تم إضافة +${points} نقطة إلى محفظتكم!`
    );

    renderOrders();
    renderInventory();
    renderWalletAndRewards();
    renderNationalStats();
    renderCharts();
  });
}

function updateOrderStatus(orderId, newStatus) {
  const order = state.data.orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    
    // Assign random default driver if assigned
    if (newStatus === 'assigned' && !order.driverName) {
      const drv = state.data.drivers[Math.floor(Math.random() * state.data.drivers.length)];
      order.driverId = drv.id;
      order.driverName = drv.name;
    }

    state.saveState();
    renderOrders();
    
    let msg = `تم تحديث حالة الطلب ${orderId} إلى: ${getStatusLabel(newStatus)}`;
    if (order.driverName) msg += ` (المندوب المسؤول: ${order.driverName})`;
    showToast(msg, 'info');

    // Show WhatsApp alert for driver status
    if (newStatus === 'assigned' || newStatus === 'en_route' || newStatus === 'collected') {
      let driverMsg = '';
      if (newStatus === 'assigned') driverMsg = `تم إسناد طلبكم للمندوب (${order.driverName}). سيصلكم قريباً للاستلام.`;
      if (newStatus === 'en_route') driverMsg = `المندوب (${order.driverName}) في الطريق الآن إلى عنوانكم لاستلام الشحنة.`;
      if (newStatus === 'collected') driverMsg = `تم استلام الشحنة بنجاح من قبل (${order.driverName}) وجارٍ نقلها لوحدة الفرز والوزن.`;

      showWhatsAppNotificationModal(order.phone, order.householdName, order.id, driverMsg);
    }
  }
}

function assignSpecificDriver(orderId, driverId) {
  const order = state.data.orders.find(o => o.id === orderId);
  const driver = state.data.drivers.find(d => d.id === driverId);
  if (order && driver) {
    order.driverId = driver.id;
    order.driverName = driver.name;
    order.status = 'assigned';
    state.saveState();
    renderOrders();
    showToast(`تم إسناد الطلب ${orderId} إلى ${driver.name}`, 'success');
    showWhatsAppNotificationModal(order.phone, order.householdName, order.id, `تم تعيين المندوب (${driver.name} - هاتف: ${driver.phone}) لاستلام فائض الطعام من عنوانكم.`);
  }
}

/* ---------------------------------------------------------
   5. Supply Orders Workflow (أصحاب المشروعات ⟷ مركز الفرز)
   --------------------------------------------------------- */
function initMarketplace() {
  const supplyForm = document.getElementById('supply-request-form');
  if (supplyForm) {
    supplyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const projName = document.getElementById('sup-proj-name').value.trim();
      const ownerName = document.getElementById('sup-owner-name')?.value.trim() || 'رائد أعمال';
      const phone = document.getElementById('sup-phone').value.trim();
      const streamSelect = document.getElementById('sup-stream');
      const streamKey = streamSelect.options[streamSelect.selectedIndex].getAttribute('data-stream-key') || 'stream2';
      const streamName = streamSelect.value;
      const amountKg = parseFloat(document.getElementById('sup-amount').value) || 50;
      const notes = document.getElementById('sup-notes')?.value.trim() || 'توريد إنتاجي لمشروع صغير';

      const newSupplyId = `SUP-${Math.floor(500 + Math.random() * 500)}`;
      const newSupply = {
        id: newSupplyId,
        projectName: projName,
        ownerName: ownerName,
        phone: phone,
        streamKey: streamKey,
        streamName: streamName,
        requestedKg: amountKg,
        status: 'pending',
        notes: notes,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };

      state.data.supplyOrders.unshift(newSupply);
      state.saveState();

      supplyForm.reset();
      closeModal('supply-modal');

      renderSupplyOrders();
      triggerConfetti();

      showToast(`تم تسجيل طلب التوريد رقم ${newSupplyId} لمشروع (${projName}) بنجاح! تم إرساله لمركز الفرز للموافقة والصرف.`, 'success');
      
      showWhatsAppNotificationModal(
        phone,
        projName,
        newSupplyId,
        `تم استلام طلبكم لتوريد (${amountKg} كجم) من مخرجات (${streamName}) في مركز التجميع. سيتم فحص المخزون وتأكيد موعد الصرف خلال دقائق.`
      );
    });
  }
}

function approveSupplyOrder(supplyId) {
  const order = state.data.supplyOrders.find(s => s.id === supplyId);
  if (!order) return;

  const currentStock = state.data.inventory[order.streamKey]?.kg || 0;
  if (currentStock < order.requestedKg) {
    showToast(`المخزون الحالي (${currentStock} كجم) أقل من الكمية المطلوبة (${order.requestedKg} كجم). يرجى الانتظار حتى اكتمال شحنات الفرز.`, 'error');
    return;
  }

  // Deduct inventory
  state.data.inventory[order.streamKey].kg -= order.requestedKg;
  order.status = 'dispatched';

  state.data.nationalStats.totalSupplyKgToBusinesses = (state.data.nationalStats.totalSupplyKgToBusinesses || 0) + order.requestedKg;
  state.saveState();

  renderSupplyOrders();
  renderInventory();
  renderNationalStats();
  renderCharts();
  triggerConfetti();

  showToast(`تمت الموافقة وصرف شحنة (${order.requestedKg} كجم) لمشروع ${order.projectName} وتحديث المخزون بنجاح!`, 'success');

  showWhatsAppNotificationModal(
    order.phone,
    order.projectName,
    order.id,
    `تمت الموافقة وتجهيز شحنتكم (${order.requestedKg} كجم) من (${order.streamName}) في مركز الفرز! جاهزة للاستلام والنقل لمقر مشروعكم.`
  );
}

function renderSupplyOrders() {
  // 1. In Collection Center Portal (Supply Requests Table)
  const centerSupplyContainer = document.getElementById('center-supply-table');
  if (centerSupplyContainer) {
    centerSupplyContainer.innerHTML = '';
    state.data.supplyOrders.forEach(sup => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-slate-100 hover:bg-slate-50 transition-colors text-sm';
      const availableKg = state.data.inventory[sup.streamKey]?.kg || 0;
      const isAvailable = availableKg >= sup.requestedKg;

      tr.innerHTML = `
        <td class="py-3 px-4 font-mono font-bold text-slate-800">${sup.id}</td>
        <td class="py-3 px-4">
          <div class="font-bold text-slate-800">${sup.projectName}</div>
          <div class="text-xs text-slate-500">${sup.ownerName} - ${sup.phone}</div>
        </td>
        <td class="py-3 px-4">
          <span class="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">${sup.streamName}</span>
          <div class="text-xs text-slate-500 mt-1">الكمية: <strong class="text-slate-800">${sup.requestedKg} كجم</strong> (المتاح بالمخزون: ${availableKg.toFixed(1)} كجم)</div>
        </td>
        <td class="py-3 px-4">
          <span class="text-xs px-2.5 py-1 rounded-full font-medium ${sup.status === 'dispatched' ? 'badge-completed' : 'badge-pending'}">
            ${sup.status === 'dispatched' ? 'تم الصرف والشحن ✅' : 'قيد المراجعة بالمركز ⏳'}
          </span>
        </td>
        <td class="py-3 px-4 text-left">
          ${sup.status === 'pending' ? `
            <button onclick="approveSupplyOrder('${sup.id}')" class="text-xs font-bold px-3 py-1.5 rounded-xl ${isAvailable ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} transition-all">
              <i class="fas fa-check ml-1"></i> موافقة وصرف الشحنة
            </button>
          ` : `
            <span class="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
              تم الصرف للمشروع
            </span>
          `}
        </td>
      `;
      centerSupplyContainer.appendChild(tr);
    });
  }

  // 2. In Business Portal (My Supply Orders List)
  const businessSupplyList = document.getElementById('business-supply-list');
  if (businessSupplyList) {
    businessSupplyList.innerHTML = '';
    state.data.supplyOrders.forEach(sup => {
      const card = document.createElement('div');
      card.className = 'p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-3 hover:border-amber-400 transition-all';
      card.innerHTML = `
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-900">${sup.id}</span>
            <span class="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">${sup.streamName}</span>
            <span class="text-xs ${sup.status === 'dispatched' ? 'text-emerald-700 font-bold' : 'text-amber-600 font-medium'}">
              ${sup.status === 'dispatched' ? 'جاهز للاستلام والتوريد' : 'قيد الفرز والتجهيز'}
            </span>
          </div>
          <p class="text-sm font-semibold text-slate-700">${sup.projectName} | الكمية: <strong class="text-emerald-700">${sup.requestedKg} كجم</strong></p>
          <p class="text-xs text-slate-400">تاريخ الطلب: ${sup.createdAt} | ملاحظات: ${sup.notes}</p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="showWhatsAppNotificationModal('${sup.phone}', '${sup.projectName}', '${sup.id}', 'استفسار بخصوص شحنة التوريد رقم ${sup.id} (${sup.streamName})')" class="btn-whatsapp px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <i class="fab fa-whatsapp text-sm"></i> محادثة واتساب المركز
          </button>
        </div>
      `;
      businessSupplyList.appendChild(card);
    });
  }
}

/* ---------------------------------------------------------
   6. Cash & Mobile Wallet Conversion Logic
   --------------------------------------------------------- */
function initCashConversion() {
  const cashForm = document.getElementById('cash-redeem-form');
  if (cashForm) {
    cashForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const optionId = document.getElementById('cash-opt-id').value;
      const walletNumber = document.getElementById('cash-wallet-number').value.trim();
      const walletType = document.getElementById('cash-wallet-type').value;

      const opt = state.data.cashOptions.find(o => o.id === optionId);
      if (!opt) return;

      if (state.data.wallet.points < opt.pointsCost) {
        showToast('رصيد نقاطك غير كافٍ لإتمام هذا التحويل', 'error');
        return;
      }

      state.data.wallet.points -= opt.pointsCost;
      state.data.wallet.cashEarnings += opt.cashAmount;

      const txId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      state.data.myCashTransactions.unshift({
        txId: txId,
        title: opt.title,
        amount: opt.cashAmount,
        walletType: walletType,
        walletNumber: walletNumber,
        pointsDeducted: opt.pointsCost,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16)
      });

      state.saveState();
      cashForm.reset();
      closeModal('cash-modal');

      triggerConfetti();
      renderWalletAndRewards();

      showToast(`تم تحويل ${opt.cashAmount} جنيه إلى رقم (${walletNumber}) بنجاح! رقم المعاملة: ${txId}`, 'success');

      showWhatsAppNotificationModal(
        walletNumber,
        'المشترك الكريم',
        txId,
        `إشعار تحويل مالي: تم بنجاح تحويل (${opt.cashAmount} جنيه مصري) كاش فوري إلى محفظتكم (${walletType}: ${walletNumber}) مقابل استبدال (${opt.pointsCost} نقطة) من منصة حفظ النعمة.`
      );
    });
  }
}

function openCashRedeemModal(optionId) {
  const opt = state.data.cashOptions.find(o => o.id === optionId);
  if (!opt) return;

  if (state.data.wallet.points < opt.pointsCost) {
    showToast(`تحتاج إلى ${opt.pointsCost} نقطة على الأقل (رصيدك الحالي: ${state.data.wallet.points} نقطة)`, 'error');
    return;
  }

  const titleEl = document.getElementById('cash-modal-title');
  const costEl = document.getElementById('cash-modal-cost');
  const amountEl = document.getElementById('cash-modal-amount');
  const optInput = document.getElementById('cash-opt-id');

  if (titleEl) titleEl.textContent = opt.title;
  if (costEl) costEl.textContent = `${opt.pointsCost} نقطة`;
  if (amountEl) amountEl.textContent = `${opt.cashAmount} جنيه`;
  if (optInput) optInput.value = opt.id;

  openModal('cash-modal');
}

/* ---------------------------------------------------------
   7. Render Functions (Wallet, Coupons, Cash, Orders)
   --------------------------------------------------------- */
function renderWalletAndRewards() {
  const ptsEl = document.getElementById('user-wallet-points');
  const ptsNavEl = document.getElementById('nav-wallet-points');
  const kgEl = document.getElementById('user-wallet-kg');
  const co2El = document.getElementById('user-wallet-co2');
  const cashEl = document.getElementById('user-wallet-cash');

  if (ptsEl) ptsEl.textContent = state.data.wallet.points;
  if (ptsNavEl) ptsNavEl.textContent = state.data.wallet.points;
  if (kgEl) kgEl.textContent = `${state.data.wallet.totalKgDonated.toFixed(1)} كجم`;
  if (co2El) co2El.textContent = `${state.data.wallet.co2SavedKg.toFixed(1)} كجم`;
  if (cashEl) cashEl.textContent = `${state.data.wallet.cashEarnings} ج.م`;

  // Render Cash Options Cards
  const cashContainer = document.getElementById('cash-options-grid');
  if (cashContainer) {
    cashContainer.innerHTML = '';
    state.data.cashOptions.forEach(opt => {
      const canRedeem = state.data.wallet.points >= opt.pointsCost;
      const card = document.createElement('div');
      card.className = 'cash-card p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-3';
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              <i class="fas ${opt.icon}"></i> ${opt.badge}
            </span>
            <span class="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              ${opt.pointsCost} نقطة
            </span>
          </div>
          <h4 class="font-bold text-slate-900 text-sm mb-1">${opt.title}</h4>
          <p class="text-2xl font-black text-emerald-600">${opt.cashAmount} <span class="text-xs font-bold text-slate-500">جنيه كاش فوري</span></p>
        </div>

        <button onclick="openCashRedeemModal('${opt.id}')" ${!canRedeem ? 'disabled' : ''} class="w-full py-2.5 px-3 rounded-xl text-xs font-bold ${canRedeem ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed'} flex items-center justify-center gap-2 transition-all">
          <i class="fas fa-money-bill-transfer"></i> ${canRedeem ? 'تحويل كاش للمحفظة' : 'نقاطك غير كافية'}
        </button>
      `;
      cashContainer.appendChild(card);
    });
  }

  // Render Coupons List
  const container = document.getElementById('coupons-grid');
  if (!container) return;

  container.innerHTML = '';
  state.data.coupons.forEach(coupon => {
    const canClaim = state.data.wallet.points >= coupon.pointsCost;
    const isClaimed = state.data.myClaimedCoupons.some(c => c.id === coupon.id);

    const card = document.createElement('div');
    card.className = 'coupon-card p-5 bg-white shadow-sm flex flex-col justify-between border border-slate-200 hover:border-emerald-500 transition-all';
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
            <i class="fas ${coupon.icon}"></i> ${coupon.category}
          </span>
          <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
            ${coupon.pointsCost} نقطة
          </span>
        </div>
        <h4 class="font-bold text-slate-800 text-base mb-1">${coupon.store}</h4>
        <p class="text-emerald-700 font-bold text-lg mb-1">${coupon.discount}</p>
        <p class="text-xs text-slate-500 mb-4">${coupon.minSpend}</p>
      </div>

      <div class="pt-3 border-t border-dashed border-slate-200">
        ${isClaimed ? `
          <button onclick="viewClaimedCoupon('${coupon.id}')" class="w-full py-2 px-3 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-2">
            <i class="fas fa-qrcode"></i> عرض الكوبون والكود
          </button>
        ` : `
          <button onclick="claimCoupon('${coupon.id}')" ${!canClaim ? 'disabled' : ''} class="w-full py-2 px-3 rounded-lg text-xs font-bold ${canClaim ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'} flex items-center justify-center gap-2 transition-all">
            <i class="fas fa-gift"></i> ${canClaim ? 'استبدال بالنقاط' : 'نقاطك غير كافية'}
          </button>
        `}
      </div>
    `;
    container.appendChild(card);
  });
}

function claimCoupon(couponId) {
  const coupon = state.data.coupons.find(c => c.id === couponId);
  if (!coupon) return;

  if (state.data.wallet.points < coupon.pointsCost) {
    showToast('رصيد نقاطك غير كافٍ لاستبدال هذا الكوبون', 'error');
    return;
  }

  state.data.wallet.points -= coupon.pointsCost;
  state.data.myClaimedCoupons.push({
    ...coupon,
    claimedAt: new Date().toISOString()
  });
  state.saveState();

  triggerConfetti();
  renderWalletAndRewards();
  showToast(`تهانينا! تم استبدال الكوبون بنجاح (${coupon.discount}).`, 'success');
  viewClaimedCoupon(couponId);
}

function viewClaimedCoupon(couponId) {
  const coupon = state.data.coupons.find(c => c.id === couponId);
  if (!coupon) return;

  const detailsEl = document.getElementById('coupon-modal-details');

  if (detailsEl) {
    detailsEl.innerHTML = `
      <div class="text-center py-4">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl mb-3">
          <i class="fas ${coupon.icon}"></i>
        </div>
        <h3 class="font-bold text-xl text-slate-800">${coupon.store}</h3>
        <p class="text-emerald-600 font-bold text-lg mt-1">${coupon.discount}</p>
        <p class="text-xs text-slate-500 mt-1">${coupon.minSpend}</p>
        
        <div class="my-6 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p class="text-xs text-slate-400 mb-1">كود القسيمة للتقديم عند الكاشير:</p>
          <p class="text-2xl font-mono font-bold tracking-widest text-slate-800 select-all">${coupon.code}</p>
          <div class="mt-3 flex justify-center">
            <div class="p-2 bg-white rounded border border-slate-200 inline-block shadow-sm">
              <i class="fas fa-barcode text-5xl text-slate-700 tracking-tighter"></i>
            </div>
          </div>
        </div>

        <p class="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-lg">
          <i class="fas fa-info-circle ml-1"></i> أظهر هذا الكود أو الباركود للكاشير عند المحاسبة في الفرع للاستفادة من الخصم.
        </p>
      </div>
    `;
  }

  openModal('coupon-view-modal');
}

function renderOrders() {
  // 1. Household Portal (My Orders with Driver details & WhatsApp)
  const householdContainer = document.getElementById('household-orders-list');
  if (householdContainer) {
    householdContainer.innerHTML = '';
    state.data.orders.forEach(order => {
      const card = document.createElement('div');
      card.className = 'p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-400 transition-all flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-sm';
      card.innerHTML = `
        <div class="space-y-1.5">
          <div class="flex flex-wrap items-center gap-2">
            <span class="font-black text-slate-900 font-mono text-base">${order.id}</span>
            <span class="text-xs px-2.5 py-0.5 rounded-full font-bold ${getStatusBadgeClass(order.status)}">
              ${getStatusLabel(order.status)}
            </span>
            ${order.driverName ? `
              <span class="driver-pill text-slate-700">
                <i class="fas fa-motorcycle text-emerald-600 ml-1"></i> ${order.driverName}
              </span>
            ` : ''}
            <span class="text-xs text-slate-400">${order.createdAt}</span>
          </div>
          <p class="text-sm font-bold text-slate-800">${order.type} - <span class="text-slate-500 font-normal">${order.category}</span></p>
          <p class="text-xs text-slate-500">الكمية المقدرة: <strong class="text-slate-800">${order.estimatedKg} كجم</strong> | موعد الاستلام: ${order.timeSlot}</p>
          ${order.notes ? `<p class="text-xs text-slate-400 italic">ملاحظات: "${order.notes}"</p>` : ''}
        </div>

        <div class="flex flex-wrap items-center gap-2">
          ${order.status === 'sorted' ? `
            <div class="text-left md:text-right bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl">
              <span class="text-xs text-emerald-800 block font-bold">المسار: ${getStreamLabel(order.destinationStream)}</span>
              <span class="text-xs text-amber-700 font-extrabold">+${order.pointsEarned} نقطة مكتسبة (وزن ${order.actualKg} كجم)</span>
            </div>
          ` : `
            <button onclick="showWhatsAppNotificationModal('${order.phone}', '${order.householdName}', '${order.id}', 'متابعة حالة الشحنة رقم ${order.id}')" class="btn-whatsapp px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow">
              <i class="fab fa-whatsapp text-sm"></i> تواصل مع المندوب
            </button>
          `}
        </div>
      `;
      householdContainer.appendChild(card);
    });
  }

  // 2. Collection Center Portal (Interactive Operations & Driver Table)
  const centerContainer = document.getElementById('center-orders-table');
  const sortSelect = document.getElementById('sort-order-select');

  if (centerContainer) {
    centerContainer.innerHTML = '';
    state.data.orders.forEach(order => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-slate-100 hover:bg-slate-50 transition-colors text-sm';
      tr.innerHTML = `
        <td class="py-3.5 px-4 font-mono font-bold text-slate-800">${order.id}</td>
        <td class="py-3.5 px-4">
          <div class="font-bold text-slate-900">${order.householdName}</div>
          <div class="text-xs text-slate-500 font-mono">${order.phone}</div>
        </td>
        <td class="py-3.5 px-4">
          <div class="text-xs text-slate-700">${order.address}</div>
          <div class="text-xs text-emerald-600 font-semibold">${order.timeSlot}</div>
        </td>
        <td class="py-3.5 px-4">
          <span class="text-xs font-bold text-slate-800 block">${order.type}</span>
          <span class="text-xs text-slate-500">${order.estimatedKg} كجم</span>
        </td>
        <td class="py-3.5 px-4">
          <span class="text-xs px-2.5 py-1 rounded-full font-bold ${getStatusBadgeClass(order.status)}">
            ${getStatusLabel(order.status)}
          </span>
          <div class="text-[11px] text-slate-500 mt-1">
            ${order.driverName ? `🛵 ${order.driverName}` : 'لم يسند مندوب بعد'}
          </div>
        </td>
        <td class="py-3.5 px-4 text-left">
          <div class="flex flex-wrap items-center gap-1.5 justify-end">
            ${order.status === 'pending' ? `
              <button onclick="updateOrderStatus('${order.id}', 'assigned')" class="text-xs bg-blue-600 text-white hover:bg-blue-700 px-2.5 py-1.5 rounded-lg font-bold shadow-sm">
                إسناد مندوب
              </button>
            ` : ''}
            ${order.status === 'assigned' ? `
              <button onclick="updateOrderStatus('${order.id}', 'en_route')" class="text-xs bg-amber-500 text-white hover:bg-amber-600 px-2.5 py-1.5 rounded-lg font-bold shadow-sm">
                المندوب بالطريق
              </button>
            ` : ''}
            ${order.status === 'en_route' ? `
              <button onclick="updateOrderStatus('${order.id}', 'collected')" class="text-xs bg-purple-600 text-white hover:bg-purple-700 px-2.5 py-1.5 rounded-lg font-bold shadow-sm">
                تم الاستلام من الباب
              </button>
            ` : ''}
            ${order.status === 'collected' ? `
              <button onclick="quickSortSelect('${order.id}')" class="text-xs bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded-lg font-bold shadow-sm">
                وزن وفرز
              </button>
            ` : ''}
            ${order.status === 'sorted' ? `
              <span class="text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-1 rounded-lg">
                مفروز (${order.actualKg} كجم)
              </span>
            ` : ''}
            <button onclick="showWhatsAppNotificationModal('${order.phone}', '${order.householdName}', '${order.id}', 'إشعار بخصوص شحنة الطعام رقم ${order.id}')" title="إرسال إشعار واتساب" class="btn-whatsapp px-2.5 py-1.5 rounded-lg text-xs font-bold">
              <i class="fab fa-whatsapp"></i>
            </button>
          </div>
        </td>
      `;
      centerContainer.appendChild(tr);
    });
  }

  // Populate Sorting Station Select
  if (sortSelect) {
    sortSelect.innerHTML = '<option value="">-- اختر شحنة مستلمة للوزن والفرز --</option>';
    const eligibleOrders = state.data.orders.filter(o => o.status === 'collected' || o.status === 'pending' || o.status === 'assigned' || o.status === 'en_route');
    eligibleOrders.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.id;
      opt.textContent = `${o.id} - ${o.householdName} (${o.type} - مقدر: ${o.estimatedKg} كجم)`;
      sortSelect.appendChild(opt);
    });
  }
}

function quickSortSelect(orderId) {
  const sortSelect = document.getElementById('sort-order-select');
  if (sortSelect) {
    sortSelect.value = orderId;
    const formEl = document.getElementById('sorting-station-card');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
      formEl.classList.add('ring-2', 'ring-emerald-500');
      setTimeout(() => formEl.classList.remove('ring-2', 'ring-emerald-500'), 2000);
    }
  }
}

function renderInventory() {
  const inv = state.data.inventory;
  const el1 = document.getElementById('inv-stream-1');
  const el2 = document.getElementById('inv-stream-2');
  const el3 = document.getElementById('inv-stream-3');
  const el4 = document.getElementById('inv-stream-4');
  const el5 = document.getElementById('inv-stream-5');

  if (el1) el1.textContent = `${inv.stream1.kg.toFixed(1)} كجم`;
  if (el2) el2.textContent = `${inv.stream2.kg.toFixed(1)} كجم`;
  if (el3) el3.textContent = `${inv.stream3.kg.toFixed(1)} كجم`;
  if (el4) el4.textContent = `${inv.stream4.kg.toFixed(1)} كجم`;
  if (el5) el5.textContent = `${inv.stream5.kg.toFixed(1)} كجم`;
}

function renderNationalStats() {
  const st = state.data.nationalStats;
  const divertedEl = document.getElementById('nat-diverted-kg');
  const co2El = document.getElementById('nat-co2-tons');
  const methaneEl = document.getElementById('nat-methane-kg');
  const familiesEl = document.getElementById('nat-families');
  const youthJobsEl = document.getElementById('nat-youth-jobs');
  const supplyKgEl = document.getElementById('nat-supply-kg');

  if (divertedEl) divertedEl.textContent = `${st.totalKgDiverted.toLocaleString('ar-EG')} كجم`;
  if (co2El) co2El.textContent = `${st.totalCO2SavedTon.toFixed(2)} طن`;
  if (methaneEl) methaneEl.textContent = `${st.totalMethaneReducedKg.toLocaleString('ar-EG')} كجم`;
  if (familiesEl) familiesEl.textContent = st.activeFamiliesCount;
  if (youthJobsEl) youthJobsEl.textContent = st.youthJobsCreated;
  if (supplyKgEl) supplyKgEl.textContent = `${(st.totalSupplyKgToBusinesses || 680).toLocaleString('ar-EG')} كجم`;
}

/* ---------------------------------------------------------
   8. WhatsApp Notification Modal & Message Generator
   --------------------------------------------------------- */
function showWhatsAppNotificationModal(phone, recipientName, referenceId, messageText) {
  const modal = document.getElementById('whatsapp-modal');
  const recipientEl = document.getElementById('wa-recipient');
  const refEl = document.getElementById('wa-reference');
  const msgEl = document.getElementById('wa-message');
  const linkEl = document.getElementById('wa-direct-link');

  if (recipientEl) recipientEl.textContent = `${recipientName} (${phone})`;
  if (refEl) refEl.textContent = referenceId;
  if (msgEl) msgEl.textContent = messageText;

  if (linkEl) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.startsWith('0') ? '2' + cleanPhone : cleanPhone;
    const encodedMsg = encodeURIComponent(`منصة حفظ النعمة 🌿\n${messageText}`);
    linkEl.href = `https://wa.me/${fullPhone}?text=${encodedMsg}`;
  }

  openModal('whatsapp-modal');
}

/* ---------------------------------------------------------
   9. Interactive Leaflet Map
   --------------------------------------------------------- */
function initLeafletMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl || typeof L === 'undefined') return;

  try {
    mapInstance = L.map('map', {
      center: [30.0444, 31.2357],
      zoom: 14,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(mapInstance);

    function createMapIcon(iconClass, bgColor) {
      return L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color: ${bgColor}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;"><i class="fas ${iconClass}"></i></div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });
    }

    state.data.locations.forEach(loc => {
      let icon = createMapIcon('fa-recycle', '#059669');
      if (loc.type === 'fridge') icon = createMapIcon('fa-snowflake', '#2563eb');
      if (loc.type === 'partner') icon = createMapIcon('fa-store', '#d97706');

      const marker = L.marker([loc.lat, loc.lng], { icon: icon }).addTo(mapInstance);
      marker.bindPopup(`
        <div style="direction: rtl; text-align: right; font-family: 'Cairo', sans-serif;">
          <h4 style="font-weight: bold; margin: 0 0 4px; color: #0f172a; font-size: 14px;">${loc.name}</h4>
          <p style="margin: 0; font-size: 12px; color: #475569;">${loc.desc}</p>
          <div style="margin-top: 6px; font-size: 11px; font-weight: bold; color: #059669;">
            ${loc.type === 'fridge' ? '🟢 متاح لوضع وأخذ الوجبات' : loc.type === 'center' ? '🏢 مركز الفرز والوزن الرئيسي' : '🏷️ شريك استبدال النقاط'}
          </div>
        </div>
      `);
    });
  } catch (err) {
    console.error('Leaflet Map initialization error:', err);
  }
}

/* ---------------------------------------------------------
   10. Chart.js Graphs (National Initiative Dashboard)
   --------------------------------------------------------- */
function initCharts() {
  if (typeof Chart === 'undefined') return;
  renderCharts();
}

function renderCharts() {
  if (typeof Chart === 'undefined') return;

  const streamCtx = document.getElementById('streamDistributionChart');
  if (streamCtx) {
    if (streamChartInstance) streamChartInstance.destroy();

    const inv = state.data.inventory;
    streamChartInstance = new Chart(streamCtx, {
      type: 'doughnut',
      data: {
        labels: [
          'ثلاجة الخير (استهلاك آدمي)',
          'أعلاف الدواجن والطيور',
          'سماد الكمبوست العضوي',
          'وحدات الغاز الحيوي',
          'يرقات الجندي الأسود (BSF)'
        ],
        datasets: [{
          data: [inv.stream1.kg, inv.stream2.kg, inv.stream3.kg, inv.stream4.kg, inv.stream5.kg],
          backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            rtl: true,
            labels: { font: { family: 'Cairo', size: 12 }, padding: 12 }
          }
        }
      }
    });
  }

  const monthlyCtx = document.getElementById('monthlySalvageChart');
  if (monthlyCtx) {
    if (monthlyChartInstance) monthlyChartInstance.destroy();

    monthlyChartInstance = new Chart(monthlyCtx, {
      type: 'bar',
      data: {
        labels: ['أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس (الحالي)'],
        datasets: [{
          label: 'كمية الفائض المجمع (كجم)',
          data: [420, 680, 950, 1220, state.data.nationalStats.totalKgDiverted],
          backgroundColor: '#059669',
          borderRadius: 8
        }, {
          label: 'توريد للمشروعات الخضراء (كجم)',
          data: [150, 280, 410, 560, (state.data.nationalStats.totalSupplyKgToBusinesses || 680)],
          backgroundColor: '#d97706',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            rtl: true,
            labels: { font: { family: 'Cairo', size: 12 } }
          }
        },
        scales: {
          x: { ticks: { font: { family: 'Cairo' } } },
          y: { beginAtZero: true, ticks: { font: { family: 'Cairo' } } }
        }
      }
    });
  }
}

/* ---------------------------------------------------------
   11. Helper Utilities & UI Modals
   --------------------------------------------------------- */
function getStatusLabel(status) {
  switch (status) {
    case 'pending': return 'قيد المراجعة';
    case 'assigned': return 'تم إسناد مندوب';
    case 'en_route': return 'المندوب في الطريق';
    case 'collected': return 'تم الاستلام بالمركز';
    case 'sorted': return 'تم الفرز والتوزيع';
    default: return status;
  }
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'pending': return 'badge-pending';
    case 'assigned': return 'badge-assigned';
    case 'en_route': return 'bg-amber-100 text-amber-900 border border-amber-300';
    case 'collected': return 'badge-collected';
    case 'sorted': return 'badge-sorted';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function getStreamLabel(streamId) {
  switch (streamId) {
    case 'stream-1': return 'ثلاجة الخير (استهلاك آدمي)';
    case 'stream-2': return 'أعلاف دواجن وطيور';
    case 'stream-3': return 'سماد كمبوست عضوي';
    case 'stream-4': return 'طاقة وغاز حيوي';
    case 'stream-5': return 'يرقات الجندي الأسود (BSF)';
    default: return 'مسار قيد التحديد';
  }
}

function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) {
    el.classList.remove('hidden');
    el.classList.add('flex');
  }
}

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) {
    el.classList.add('hidden');
    el.classList.remove('flex');
  }
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-5 left-5 z-50 py-3.5 px-5 rounded-2xl shadow-2xl text-white font-bold text-sm flex items-center gap-3 transition-all duration-300 transform translate-y-10 opacity-0 ${
    type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-slate-900'
  }`;
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-info-circle'} text-lg"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  }, 50);

  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function triggerConfetti() {
  if (typeof confetti !== 'undefined') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

function printNationalDossier() {
  window.print();
}

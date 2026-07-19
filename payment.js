// NexKod - WhatsApp Payment System (100% Free, No API Keys)
let currentPlan = {}, currentMethod = '';

function selectPlan(id, price) {
    currentPlan = { id, price };
    const names = { basic: 'بنەڕەتی', pro: 'پیشەیی', enterprise: 'ڕێکخراوە' };
    document.getElementById('pPlan').textContent = names[id];
    document.getElementById('pPrice').textContent = price.toLocaleString() + ' د.ع';
    document.getElementById('payModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePayModal() {
    document.getElementById('payModal').style.display = 'none';
    document.body.style.overflow = '';
}

document.querySelectorAll('input[name="pm"]').forEach(r => {
    r.onchange = (e) => {
        currentMethod = e.target.value;
        document.getElementById('payForm').style.display = 'block';
    };
});

async function initiateWhatsAppPayment() {
    const phone = document.getElementById('payPhone').value.replace(/\s/g, '');
    const email = document.getElementById('payEmail').value.trim();
    
    if (!currentMethod) return alert('تکایە ڕێگای پارەدان هەڵبژێرە');
    if (!/^(\+964|0)?7[0-9]{9}$/.test(phone)) return alert('ژمارەی تەلەفۆن نادروستە');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert('ئیمەیڵ نادروستە');

    const orderId = 'NK-' + Date.now().toString().slice(-8);
    const planNames = { basic: 'بنەڕەتی (٢٥٠,٠٠٠ د.ع)', pro: 'پیشەیی (٧٥٠,٠٠٠ د.ع)', enterprise: 'ڕێکخراوە (٢,٥٠,٠٠٠ د.ع)' };
    
    const message = ` *NexKod - داواکاری ماڵپەڕ*\n\n📋 ژمارەی ئۆردەر: ${orderId}\n پاکێج: ${planNames[currentPlan.id]}\n💰 بڕ: ${currentPlan.price.toLocaleString()} د.ع\n\n👤 تەلەفۆن: ${phone}\n📧 ئیمەیڵ: ${email}\n💳 ڕێگا: ${currentMethod.toUpperCase()}\n\n📝 تکایە پسوولەی پارەدان بنێرە بۆ چالاککردنی ماڵپەڕ.`;
    
    // ⚠️ ژمارەی واتسئەپی خۆت لێرە بنووسە (بێ +)
    const YOUR_WHATSAPP_NUMBER = '9647501234567'; 
    
    if(confirm(`✅ داواکاری ئامادەیە!\n🔖 ${orderId}\n💰 ${currentPlan.price.toLocaleString()} د.ع\n\nدەچیتە واتسئەپ بۆ ناردن.`)) {
        window.open(`https://wa.me/${YOUR_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
        
        // Save to localStorage for admin panel
        const orders = JSON.parse(localStorage.getItem('nexkod_orders') || '[]');
        orders.push({ orderId, plan: currentPlan.id, price: currentPlan.price, phone, email, method: currentMethod, status: 'pending', createdAt: new Date().toISOString() });
        localStorage.setItem('nexkod_orders', JSON.stringify(orders));
        
        closePayModal();
        document.getElementById('siteLink').textContent = `چاوەڕێی چالاککردن بکە... (${orderId})`;
        document.getElementById('successModal').style.display = 'flex';
    }
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Expose to window
window.selectPlan = selectPlan;
window.closePayModal = closePayModal;
window.initiateWhatsAppPayment = initiateWhatsAppPayment;
window.closeSuccessModal = closeSuccessModal;

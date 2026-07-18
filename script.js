let rowCount = 0;

const remarks = [
    { value: "", text: "Select Remark" },
    { value: "claim_settled", text: "Claim Fully Settled" },
    { value: "service_short", text: "Service Period Less Than 6 Months" },
    { value: "service_long", text: "Service Period Exceeding 10 Years" },
    { value: "transfer_initiated", text: "PF Transfer Request Initiated" },
    { value: "active_contribution", text: "Active Contribution Period" }
];

function addRow() {
    rowCount++;
    const tbody = document.getElementById('tableBody');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${rowCount}</td>
        <td><input type="text" class="est-name" placeholder="Company Name" oninput="calculateRow(this)"></td>
        <td><input type="text" class="pf-no" placeholder="PF No." oninput="calculateRow(this)"></td>
        <td><input type="number" class="emp-share" placeholder="0.00" step="0.01" oninput="calculateRow(this)"></td>
        <td><input type="number" class="empr-share" placeholder="0.00" step="0.01" oninput="calculateRow(this)"></td>
        <td><input type="number" class="pension" placeholder="0.00" step="0.01" oninput="calculateRow(this)"></td>
        <td><input type="text" class="row-total" value="0.00" readonly style="border:none; background:transparent; font-weight:600;"></td>
        <td>
            <select class="remark-select" onchange="calculateRow(this)">
                ${remarks.map(r => `<option value="${r.value}">${r.text}</option>`).join('')}
            </select>
        </td>
        <td class="hide-on-export"><button onclick="this.closest('tr').remove(); updateSerialNumbers(); calculateTotals()" class="remove-row">Remove</button></td>
    `;
    tbody.appendChild(row);
}

function calculateRow(el) {
    const row = el.closest('tr');
    const emp = parseFloat(row.querySelector('.emp-share').value) || 0;
    const empr = parseFloat(row.querySelector('.empr-share').value) || 0;
    const pension = parseFloat(row.querySelector('.pension').value) || 0;
    row.querySelector('.row-total').value = (emp + empr + pension).toFixed(2);
    calculateTotals();
}

function calculateTotals() {
    let empT = 0, emprT = 0, pensT = 0;
    document.querySelectorAll('#tableBody tr').forEach(r => {
        empT += parseFloat(r.querySelector('.emp-share').value) || 0;
        emprT += parseFloat(r.querySelector('.empr-share').value) || 0;
        pensT += parseFloat(r.querySelector('.pension').value) || 0;
    });
    
    const grand = empT + emprT + pensT;
    document.getElementById('totalEmp').textContent = `₹${empT.toFixed(2)}`;
    document.getElementById('totalEmpr').textContent = `₹${emprT.toFixed(2)}`;
    document.getElementById('totalPension').textContent = `₹${pensT.toFixed(2)}`;
    document.getElementById('grandTotal').textContent = `₹${grand.toFixed(2)}`;
}

function updateSerialNumbers() {
    document.querySelectorAll('#tableBody tr').forEach((row, i) => row.cells[0].textContent = i + 1);
    rowCount = document.querySelectorAll('#tableBody tr').length;
}

// Optimized Landscape PDF Download
async function downloadPDF() {
    const container = document.getElementById('capture');
    container.classList.add('pdf-mode');
    
    // Tiny delay to ensure layout re-renders cleanly
    await new Promise(resolve => setTimeout(resolve, 100));

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a3' });
    
    const canvas = await html2canvas(container, { 
        scale: 2,
        useCORS: true,
        backgroundColor: '#0c0a2e' // Matches default dark app aesthetic
    });
    
    const imgData = canvas.toDataURL('image/png');
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    
    doc.addImage(imgData, 'PNG', 10, 10, w - 20, h - 20);
    doc.save(`EPF_Passbook_${document.getElementById('empName').value || 'Employee'}.pdf`);
    
    container.classList.remove('pdf-mode');
}

// Optimized JPG Download
async function downloadJPG() {
    const container = document.getElementById('capture');
    container.classList.add('pdf-mode');
    
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(container, { 
        scale: 2,
        useCORS: true,
        backgroundColor: '#0c0a2e'
    });
    
    const link = document.createElement('a');
    link.download = `EPF_Passbook_${document.getElementById('empName').value || 'Employee'}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
    
    container.classList.remove('pdf-mode');
}

// Init
window.onload = () => addRow();
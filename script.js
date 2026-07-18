let rowCount = 0;

const remarks = [
    { value: "", text: "Select Remark" },
    { value: "claim_settled", text: "Claim Fully Settled" },
    { value: "service_short", text: "Service Period Less Than 6 Months" },
    { value: "service_long", text: "Service Period Exceeding 10 Years" },
    { value: "transfer_initiated", text: "PF Transfer Request Initiated" },
    { value: "active_contribution", text: "Active Contribution Period" }
];

function addRow(data = {}) {
    rowCount++;
    const tbody = document.getElementById('tableBody');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${rowCount}</td>
        <td><input type="text" class="est-name" value="${data.est || 'TechVision Solutions Pvt Ltd'}" oninput="calculateRow(this)"></td>
        <td><input type="text" class="pf-no" value="${data.pf || 'KN/45678/9876543'}" oninput="calculateRow(this)"></td>
        <td><input type="number" class="emp-share" value="${data.emp || 14500}" step="0.01" oninput="calculateRow(this)"></td>
        <td><input type="number" class="empr-share" value="${data.empr || 4350}" step="0.01" oninput="calculateRow(this)"></td>
        <td><input type="number" class="pension" value="${data.pens || 2175}" step="0.01" oninput="calculateRow(this)"></td>
        <td><input type="text" class="row-total" value="0.00" readonly></td>
        <td>
            <select class="remark-select" onchange="calculateRow(this)">
                ${remarks.map(r => `<option value="${r.value}" ${data.rem === r.value ? 'selected' : ''}>${r.text}</option>`).join('')}
            </select>
        </td>
        <td><button onclick="this.closest('tr').remove(); updateSerialNumbers(); calculateTotals();" class="btn remove-row">Remove</button></td>
    `;
    
    tbody.appendChild(row);
    calculateRow(row.querySelector('input'));
}

function calculateRow(el) {
    const row = el.closest('tr');
    const emp = parseFloat(row.querySelector('.emp-share').value) || 0;
    const empr = parseFloat(row.querySelector('.empr-share').value) || 0;
    const pension = parseFloat(row.querySelector('.pension').value) || 0;
    
    const total = (emp + empr + pension).toFixed(2);
    row.querySelector('.row-total').value = total;
    
    calculateTotals();
}

function calculateTotals() {
    let totalEmp = 0, totalEmpr = 0, totalPension = 0;
    
    document.querySelectorAll('#tableBody tr').forEach(row => {
        totalEmp += parseFloat(row.querySelector('.emp-share').value) || 0;
        totalEmpr += parseFloat(row.querySelector('.empr-share').value) || 0;
        totalPension += parseFloat(row.querySelector('.pension').value) || 0;
    });
    
    const grand = totalEmp + totalEmpr + totalPension;
    
    document.getElementById('totalEmp').textContent = `₹${totalEmp.toFixed(2)}`;
    document.getElementById('totalEmpr').textContent = `₹${totalEmpr.toFixed(2)}`;
    document.getElementById('totalPension').textContent = `₹${totalPension.toFixed(2)}`;
    document.getElementById('grandTotal').textContent = `₹${grand.toFixed(2)}`;
}

function updateSerialNumbers() {
    document.querySelectorAll('#tableBody tr').forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}

// Download Functions
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    
    const canvas = await html2canvas(document.querySelector('.container'), { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();
    
    doc.addImage(imgData, 'PNG', 8, 8, pdfWidth - 16, pdfHeight - 16);
    doc.save(`EPF_Passbook_${document.getElementById('empName').value || 'Employee'}.pdf`);
}

async function downloadJPG() {
    const canvas = await html2canvas(document.querySelector('.container'), { scale: 2 });
    const link = document.createElement('a');
    link.download = `EPF_Passbook_${document.getElementById('empName').value || 'Employee'}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
}

// Initialize
window.onload = () => {
    addRow();
    addRow();
    addRow();
};

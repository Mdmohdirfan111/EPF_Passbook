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
        <td><input type="text" class="est-name" placeholder="Establishment Name" oninput="calculateRow(this)"></td>
        <td><input type="text" class="pf-no" placeholder="PF Account No." oninput="calculateRow(this)"></td>
        <td><input type="number" class="emp-share" placeholder="0.00" step="0.01" oninput="calculateRow(this)"></td>
        <td><input type="number" class="empr-share" placeholder="0.00" step="0.01" oninput="calculateRow(this)"></td>
        <td><input type="number" class="pension" placeholder="0.00" step="0.01" oninput="calculateRow(this)"></td>
        <td><input type="text" class="row-total" value="0.00" readonly></td>
        <td>
            <select class="remark-select" onchange="calculateRow(this)">
                ${remarks.map(r => `<option value="${r.value}">${r.text}</option>`).join('')}
            </select>
        </td>
        <td><button onclick="this.closest('tr').remove(); updateSerialNumbers(); calculateTotals();" class="btn remove-row" style="background:#ef4444; color:white; padding:8px 14px; font-size:0.9rem;">Remove</button></td>
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
    let empTotal = 0, emprTotal = 0, pensTotal = 0;
    
    document.querySelectorAll('#tableBody tr').forEach(row => {
        empTotal += parseFloat(row.querySelector('.emp-share').value) || 0;
        emprTotal += parseFloat(row.querySelector('.empr-share').value) || 0;
        pensTotal += parseFloat(row.querySelector('.pension').value) || 0;
    });
    
    const grand = empTotal + emprTotal + pensTotal;
    
    document.getElementById('totalEmp').textContent = `₹${empTotal.toFixed(2)}`;
    document.getElementById('totalEmpr').textContent = `₹${emprTotal.toFixed(2)}`;
    document.getElementById('totalPension').textContent = `₹${pensTotal.toFixed(2)}`;
    document.getElementById('grandTotal').textContent = `₹${grand.toFixed(2)}`;
}

function updateSerialNumbers() {
    document.querySelectorAll('#tableBody tr').forEach((row, i) => {
        row.cells[0].textContent = i + 1;
    });
    rowCount = document.querySelectorAll('#tableBody tr').length;
}

// Download Functions
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    
    const canvas = await html2canvas(document.querySelector('.container'), { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    
    doc.addImage(imgData, 'PNG', 10, 10, w-20, h-20);
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
    // Start with one empty row
    addRow();
};

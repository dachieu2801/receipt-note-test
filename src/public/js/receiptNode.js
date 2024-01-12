const api = 'http://localhost:3000/receipt/creat-receipt'

const $ = document.getElementById.bind(document)

const table = $("data-table").getElementsByTagName('tbody')[0]
const donvi1 = $("donvi")
const part1 = $("part")
const receipt_date1 = $("receipt-date")
const receipt_month1 = $("receipt-month")
const receipt_year1 = $("receipt-year")
const receipt_no1 = $("receipt-no")
const payable1 = $("payable")
const co1 = $("co")
const deliverer_name1 = $("deliverer_name")
const according_law11 = $("according-law")
const number_law1 = $("number-law")
const date_law1 = $("date-law")
const month_law1 = $("month-law")
const year_law1 = $("year-law")
const of_law1 = $("of-law")
const receive_warehouse_name1 = $("receive-warehouse-name")
const receive_warehouse_place1 = $("receive-warehouse-place")
const total_price_string1 = $("total-price-string")
const original_document_number_attached1 = $("original-document-number-attached")
const signature_date1 = $("signature-date")
const signature_month1 = $("signature-month")
const signature_year1 = $("signature-year")
const receipt_creator1 = $("receipt-creator")
const deliverer_name11 = $("deliverer-name")
const storekeeper1 = $("storekeeper")
const chief_accountant1 = $("chief-accountant")
const total_price_number1 = $("total-price-number")

/////////////////////////////////////////////////////////////////////////////////////////////////////////

//call to focus and blur can active
focusBlur(receipt_no1)
focusBlur(donvi1)
focusBlur(part1)
focusBlur(receipt_date1, 'date')
focusBlur(receipt_month1, 'month')
focusBlur(receipt_year1, 'year')
focusBlur(payable1, '', true)
focusBlur(co1, '', true)
focusBlur(deliverer_name1)
focusBlur(according_law11)
focusBlur(number_law1)
focusBlur(date_law1, 'date')
focusBlur(month_law1, 'month')
focusBlur(year_law1, 'year')
focusBlur(of_law1)
focusBlur(receive_warehouse_name1)
focusBlur(receive_warehouse_place1)
focusBlur(total_price_string1)
focusBlur(original_document_number_attached1)
focusBlur(signature_date1, 'date')
focusBlur(signature_month1, 'month')
focusBlur(signature_year1, 'year')
focusBlur(receipt_creator1)
focusBlur(deliverer_name11)
focusBlur(storekeeper1)
focusBlur(chief_accountant1)

// call for cell in table 

function callTable() {
  for (let i = 0; i < table.rows.length - 1; i++) {
    const row = table.rows[i]
    const cell1 = row.cells[1].getElementsByTagName('input')[0]
    const cell2 = row.cells[2].getElementsByTagName('input')[0]
    const cell3 = row.cells[3].getElementsByTagName('input')[0]
    const cell4 = row.cells[4].getElementsByTagName('input')[0]
    const cell5 = row.cells[5].getElementsByTagName('input')[0]
    const cell6 = row.cells[6].getElementsByTagName('input')[0]
    const cell7 = row.cells[7].getElementsByTagName('input')[0]
    focusBlur(cell1)
    focusBlur(cell2)
    focusBlur(cell3)
    focusBlur(cell4, '', true)
    focusBlur(cell5, '', true, 'cell')
    focusBlur(cell6, '', true, 'cell')
    focusBlur(cell7, '', true, 'cell7')
  }
}
callTable()

// submit receiptNote when keydown enter
document.addEventListener('keydown', async function (e) {
  e.stopPropagation()
  if (e.target.tagName !== "BUTTON") {
    if (e.key === 'Enter') {
      const isValid = validateForm()
      if (isValid) {
        function getValue(input) {
          return input.value.trim()
        }
        const body = {
          //get date in receipt - table
          receiptNote: {
            receipt_no: getValue(receipt_no1),
            donvi: getValue(donvi1),
            part: getValue(part1),
            date_receipt: new Date(getValue(receipt_date1), getValue(receipt_month1), getValue(receipt_date1)),
            payable: getValue(payable1),
            co: getValue(co1),
            deliverer_name: getValue(deliverer_name1),
            according_law: `Theo ${getValue(according_law11)} số ${getValue(number_law1)}`
              +
              ` Ngày ${getValue(date_law1)} tháng ${getValue(month_law1)} năm ${getValue(year_law1)} `
              +
              `của ${getValue(of_law1)}`,
            receive_warehouse_name: getValue(receive_warehouse_name1),
            receive_warehouse_place: getValue(receive_warehouse_place1),
            total_price_string: convertNumberToWords(getTotalPrice()),
            total_price_number: getTotalPrice(),
            original_document_number_attached: getValue(original_document_number_attached1),
            receipt_creator: getValue(receipt_creator1),
            storekeeper: getValue(storekeeper1),
            receive_signature_date: new Date(getValue(signature_year1), getValue(signature_month1), getValue(signature_date1)),
            chief_accountant: getValue(chief_accountant1)
          },
          products: []
        }
        ////get data in table 
        for (let i = 0; i < table.rows.length - 1; i++) {
          const row = table.rows[i]
          const cell1 = row.cells[1].getElementsByTagName('input')[0]
          const cell2 = row.cells[2].getElementsByTagName('input')[0]
          const cell3 = row.cells[3].getElementsByTagName('input')[0]
          const cell4 = row.cells[4].getElementsByTagName('input')[0]
          const cell5 = row.cells[5].getElementsByTagName('input')[0]
          const cell6 = row.cells[6].getElementsByTagName('input')[0]
          body.products.push({
            product_name: getValue(cell1),
            product_id: getValue(cell2),
            unit_money: getValue(cell3),
            quantity_according_doc: getValue(cell4),
            actual_quantity_received: getValue(cell5),
            unit_price: getValue(cell6),
          })
        }
        try {
          const response = await fetch(api, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          })
          const data = await response.json()
          console.log(data);
          if (data.status === 'success') {
            alert('Crete success')
          } else {
            alert(data.message)
          }
        } catch (err) {
          console.log(err);
          alert('Fetch failed')
        }
      } else {
        alert('Please enter all red field')
      }
    }
  }
}, true)

////////////////////////////////////////////////////////////////////////////////////////////
//add row in before last row
function addRow() {
  const newRow = table.insertRow(table.rows.length - 1);
  const cells = []
  // add cell
  for (let i = 0; i < table.rows[0].cells.length - 1; i++) {
    cells[i] = newRow.insertCell(i)
    const input = document.createElement("input")
    if (i === 0) {
      cells[i].textContent = table.rows.length - 1
      continue
    }
    if (i === 1 || i === 3) {
      input.type = "text"
      input.name = "text[]"
    } else {
      input.type = "number"
      input.name = "number[]"
    }
    cells[i].appendChild(input)
  }

  const actionCell = newRow.insertCell(cells.length)
  const removeButton = document.createElement("button")
  removeButton.innerHTML = "Remove"
  removeButton.onclick = function () { removeRow(this) }
  actionCell.appendChild(removeButton)
  callTable()
}

//can delete if row > 2
function removeRow(button) {
  if (table.rows.length > 2) {
    const isconfirm = confirm("Remove this row?")
    if (isconfirm) {
      const row = button.parentNode.parentNode;
      row.parentNode.removeChild(row);
      //update stt when remove
      for (let i = 0; i < table.rows.length - 1; i++) {
        const row = table.rows[i];
        row.cells[0].textContent = i + 1;
      }
    }
    callTable()
  }
}

//hadle input when it empty
function erorrHandle(input1) {
  input1.value = null
  input1.style.border = '1px solid red'
  input1.style.borderRadius = '5px'
  input1.style.marginTop = '2px'
  input1.style.marginBottom = '2px'
}
//totalpice of products in table 
function getTotalPrice() {
  let totalPrice = 0
  for (let i = 0; i < table.rows.length - 1; i++) {
    const row = table.rows[i]
    const cell5 = row.cells[5].getElementsByTagName('input')[0]
    const cell6 = row.cells[6].getElementsByTagName('input')[0]
    const cell7 = row.cells[7].getElementsByTagName('input')[0]
    if (cell5.value && cell6.value) {
      //total in the row of table
      cell7.value = cell5.value * cell6.value
      totalPrice = totalPrice + Number(cell7.value)
    }
  }
  total_price_number1.innerHTML = totalPrice
  const words = convertNumberToWords(totalPrice)
  total_price_string1.value = words
  return totalPrice
}
//add event focus and blur for input
// ag1: imput,ag2 : check date is date ,month or year ,
//ag3 : check for input need positive
// ag4: to get and up total price if néed
function focusBlur(input, date, positive, cell) {
  //remove err
  input.addEventListener('focus', (e) => {
    input.style.border = 'none'
  })
  //add err when wrong
  input.addEventListener('blur', (e) => {
    if (cell === 'cell') {
      getTotalPrice()
    }
    if (cell === 'cell7') {
      getTotalPrice()
    }
    //sw-case
    checkDate(input, date)
    //kiểm tra xem nếu input mà âm thì báo lỗi
    if (positive) {
      isPositive(input)
    }
  })
}
//validate and get dâta before submit 
function validateForm() {
  let status = true
  checkInput(donvi1)
  checkInput(part1)
  checkInput(receipt_date1, 'date')
  checkInput(receipt_month1, 'month')
  checkInput(receipt_year1, 'year')
  checkInput(receipt_no1)
  checkInput(co1, false, true)
  checkInput(payable1, false, true)
  checkInput(deliverer_name1)
  checkInput(according_law11)
  checkInput(number_law1)
  checkInput(date_law1)
  checkInput(month_law1)
  checkInput(year_law1)
  checkInput(of_law1)
  checkInput(receive_warehouse_name1)
  checkInput(receive_warehouse_place1)
  checkInput(total_price_string1)
  checkInput(original_document_number_attached1)
  checkInput(signature_date1, 'date')
  checkInput(signature_month1, 'month')
  checkInput(signature_year1, 'year')
  checkInput(receipt_creator1)
  checkInput(deliverer_name11)
  checkInput(storekeeper1)
  checkInput(chief_accountant1)
  // check cell and get value in table
  for (let i = 0; i < table.rows.length - 1; i++) {
    const row = table.rows[i]
    for (let j = 1; j <= 7; j++) {
      if (j <= 3) {
        const cell = row.cells[j].getElementsByTagName('input')[0]
        checkInput(cell)
      } else {
        const cell = row.cells[j].getElementsByTagName('input')[0]
        checkInput(cell, false, true)
      }
    }
  }
  return status

  //check value input if invalidate then chan boder to user can see
  function checkInput(input, date, positive) {
    if (!input.value.trim()) {
      erorrHandle(input)
      return status = false
    }
    if (positive) {
      if (input.value < 0) {
        input.value = null
        erorrHandle(input)
        return status = false
      }
    }
    checkDate(input, date)
  }
}

// check range date,month,year
function checkDate(input, date) {
  if (!input.value) {
    return erorrHandle(input)
  }
  if (date === 'date') {
    minMaxDate(input, 1, 31)
  } else if (date === 'month') {
    minMaxDate(input, 1, 12)
  } else if (date === 'year') {
    minMaxDate(input, 1900, 2500)
  }
}

function minMaxDate(input, min, max) {
  if (input.value) {
    if (input.value < min || input.value > max) {
      erorrHandle(input)
    } else {
      input.value = Math.floor(input.value)
    }
  } else {
    erorrHandle(input)
  }
}

//convert monney number to words
function convertNumberToWords(number) {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertLessThanThousand(n) {
    if (n === 0) return '';
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    const digit = n % 10;
    if (n < 100) return tens[Math.floor(n / 10)] + (digit !== 0 ? ' ' + units[digit] : '');
    return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
  }

  if (number === 0) return 'Zero';
  const billion = Math.floor(number / 1000000000);
  const million = Math.floor((number % 1000000000) / 1000000);
  const thousand = Math.floor((number % 1000000) / 1000);
  const remainder = number % 1000;

  let result = '';
  if (billion) result += convertLessThanThousand(billion) + ' Billion ';
  if (million) result += convertLessThanThousand(million) + ' Million ';
  if (thousand) result += convertLessThanThousand(thousand) + ' Thousand ';
  if (remainder) result += convertLessThanThousand(remainder);

  return result.trim();
}
//
function isPositive(input) {
  if (input.value < 0) {
    erorrHandle(input)
    input.value = null
  }
}

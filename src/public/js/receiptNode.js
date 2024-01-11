const api = 'http://localhost:3000/receipt/creat-receipt'

const $ = document.getElementById.bind(document)
const table = $("data-table").getElementsByTagName('tbody')[0]
const donvi = $("donvi")
const part = $("part")
const receipt_date = $("receipt-date")
const receipt_month = $("receipt-month")
const receipt_year = $("receipt-year")
const receipt_no = $("receipt-no")
const payable = $("payable")
const co = $("co")
const deliverer_name = $("deliverer_name")
const according_law1 = $("according-law")
const number_law = $("number-law")
const date_law = $("date-law")
const month_law = $("month-law")
const year_law = $("year-law")
const of_law = $("of-law")
const receive_warehouse_name = $("receive-warehouse-name")
const receive_warehouse_place = $("receive-warehouse-place")
const total_price_string = $("total-price-string")
const original_document_number_attached = $("original-document-number-attached")
const signature_date = $("signature-date")
const signature_month = $("signature-month")
const signature_year = $("signature-year")
const receipt_creator = $("receipt-creator")
const deliverer_name1 = $("deliverer-name")
const storekeeper = $("storekeeper")
const chief_accountant = $("chief-accountant")
const total_price_number = $("total-price-number")

/////////////////////////////////////////////////////////////////////////////////////////////////////////

//call to focus and blur can active
focusBlur(donvi)
focusBlur(part)
focusBlur(receipt_date, 'date')
focusBlur(receipt_month, 'month')
focusBlur(receipt_year, 'year')
focusBlur(receipt_no)
focusBlur(payable)
focusBlur(co)
focusBlur(deliverer_name)
focusBlur(according_law1)
focusBlur(number_law)
focusBlur(date_law, 'date')
focusBlur(month_law, 'month')
focusBlur(year_law, 'year')
focusBlur(of_law)
focusBlur(receive_warehouse_name)
focusBlur(receive_warehouse_place)
focusBlur(total_price_string)
focusBlur(original_document_number_attached)
focusBlur(signature_date, 'date')
focusBlur(signature_month, 'month')
focusBlur(signature_year, 'year')
focusBlur(receipt_creator)
focusBlur(deliverer_name1)
focusBlur(storekeeper)
focusBlur(chief_accountant)

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
    focusBlur(cell4)
    focusBlur(cell5, '', 'cell')
    focusBlur(cell6, '', 'cell')
    focusBlur(cell7, '', 'cell7')

  }
}
callTable()

//submit receiptNote when keydown enter
document.addEventListener('keydown', async function (event) {
  if (event.key === 'Enter') {
    const { receiptNote, products, status } = validateForm()
    if (status === true) {
      try {
        const response = await fetch(api, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ receiptNote, products }), // Chuyển đối tượng JSON thành chuỗi JSON
        })
        const isSuccess = await response.json()
        if (isSuccess.message === 'success') {
          alert('Crete success')
        } else {
          alert(isSuccess)
        }
      } catch (err) {
        console.log(err);
        alert('Fetch failed')
      }
    } else {
      alert('Please enter all red field')
    }
  }
})

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
      cell7.value = cell5.value * cell6.value
      totalPrice = totalPrice + Number(cell7.value)
    }
  }
  total_price_number.innerHTML = totalPrice
}

//add event focus and blur for input
function focusBlur(input, checkDate, cell) {
  input.addEventListener('focus', () => {
    input.style.border = 'none'
  })
  input.addEventListener('blur', () => {
    if (cell === 'cell') {
      getTotalPrice()
    }
    if (cell === 'cell7') {
      getTotalPrice()
    }
    if (checkDate === 'date') {
      minMaxDate(1, 31)
    } else if (checkDate === 'month') {
      minMaxDate(1, 12)
    } else if (checkDate === 'year') {
      minMaxDate(1900, 2500)
    } else {
      if (!input.value.trim()) {
        erorrHandle(input)
      }
    }
  })
  function minMaxDate(min, max) {
    if (input.value.trim()) {
      if (input.value < min || input.value > max) {
        erorrHandle(input)
      } else {
        input.value = Math.floor(input.value)
      }
    } else {
      erorrHandle(input)
    }
  }
}


//validate and get dâta before submit 
function validateForm() {
  const receiptNote = {}
  const products = []
  let status = true
  checkInput(donvi, 'donvi',)
  checkInput(part, 'part')
  const receipt_date1 = checkInput(receipt_date, 'receipt_date', 'date')
  const receipt_month1 = checkInput(receipt_month, 'receipt_month', 'month')
  const receipt_year1 = checkInput(receipt_year, 'receipt_year', 'year')
  checkInput(receipt_no, 'receipt_no')
  checkInput(co, 'co')
  checkInput(payable, 'payable')
  checkInput(deliverer_name, 'deliverer_name')
  const according = checkInput(according_law1, 'according_law1')
  const number = checkInput(number_law, 'number_law')
  const date_law1 = checkInput(date_law, 'date_law', 'date')
  const month_law1 = checkInput(month_law, 'month_law', 'month')
  const year_law1 = checkInput(year_law, 'year_law', 'year')
  const of = checkInput(of_law, 'of_law')
  checkInput(receive_warehouse_name, 'receive_warehouse_name')
  checkInput(receive_warehouse_place, 'receive_warehouse_place')
  checkInput(total_price_string, 'total_price_string')
  checkInput(original_document_number_attached, 'original_document_number_attached')
  const signature_date1 = checkInput(signature_date, 'signature_date', 'date')
  const signature_month1 = checkInput(signature_month, 'signature_month', 'month')
  const signature_year1 = checkInput(signature_year, 'signature_year', 'year')
  checkInput(receipt_creator, 'receipt_creator')
  checkInput(deliverer_name1, 'deliverer_name1')
  checkInput(storekeeper, 'storekeeper')
  checkInput(chief_accountant, 'chief_accountant')

  receiptNote.date_receipt = new Date(receipt_year1, receipt_month1, receipt_date1)
  receiptNote.according_law = `Theo ${according} số ${number} Ngày ${date_law1} tháng ${month_law1} năm ${year_law1} của ${of}`
  receiptNote.receive_signature_date = new Date(signature_year1, signature_month1, signature_date1)

  let total = 0
  // check cell and get value in table
  for (let i = 0; i < table.rows.length - 1; i++) {
    const row = table.rows[i]
    const cell1 = row.cells[1].getElementsByTagName('input')[0]
    const cell2 = row.cells[2].getElementsByTagName('input')[0]
    const cell3 = row.cells[3].getElementsByTagName('input')[0]
    const cell4 = row.cells[4].getElementsByTagName('input')[0]
    const cell5 = row.cells[5].getElementsByTagName('input')[0]
    const cell6 = row.cells[6].getElementsByTagName('input')[0]
    const cell7 = row.cells[7].getElementsByTagName('input')[0]
    if (cell1.value.trim() && cell2.value.trim() && cell3.value.trim() && cell4.value.trim()
      && cell5.value.trim() && cell6.value.trim()) {
      cell7.value = cell5.value * cell6.value
      total = Number(total) + Number(cell7.value)
      products.push({
        product_name: cell1.value.trim(),
        product_id: cell2.value.trim(),
        unit_money: cell3.value.trim(),
        quantity_according_doc: cell4.value.trim(),
        actual_quantity_received: cell5.value.trim(),
        unit_price: cell6.value,
        total_price_number: cell7.value
      })
    }
    checkInput(cell1, '', '', true)
    checkInput(cell2, '', '', true)
    checkInput(cell3, '', '', true)
    checkInput(cell4, '', '', true)
    checkInput(cell5, '', '', true)
    checkInput(cell6, '', '', true)
    checkInput(cell7, '', '', true)
  }
  total_price_number.innerHTML = total
  receiptNote.total_price_number = total

  return { receiptNote, products, status }

  //check value input if invalidate then chan boder to user can see
  function checkInput(input, key, checkDate, istable) {
    if (istable) {
      if (!input.value.trim()) {
        erorrHandle(input)
        status = false
      }
    } else {
      if (checkDate === 'date') {
        return minMaxDate(1, 31)
      } else if (checkDate === 'month') {
        return minMaxDate(1, 12)
      } else if (checkDate === 'year') {
        return minMaxDate(1900, 2500)
      } else {
        if (!input.value.trim()) {
          erorrHandle(input)
          status = false
        } else {
          receiptNote[key] = input.value.trim()
          return input.value
        }
      }
    }
    function minMaxDate(min, max) {
      if (input.value.trim()) {
        if (input.value < min || input.value > max) {
          erorrHandle(input)
          status = false
        } else {
          input.value = Math.floor(input.value)
          return input.value
        }
      } else {
        erorrHandle(input)
      }
    }
  }
}

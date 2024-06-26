// row.querySelector('.review').addEventListener('click', function() {
//        displayReviewModal(request);
//      });
//    });


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

document.addEventListener('DOMContentLoaded', function() {
  const idHeader = document.getElementById('idHeader');
  const statusHeader = document.getElementById('statusHeader');
  const descriptionHeader = document.getElementById('descriptionHeader');
  const activityHeader = document.getElementById('activityHeader');
  const nextPageButton = document.getElementById('nextPage');
  const prevPageButton = document.getElementById('prevPage');
  const createRequestButton = document.getElementById('createRequest');
  const tableBody = document.querySelector('tbody');
  const modal = document.getElementById('modal');
  const closeModals = document.querySelectorAll('.close');
  const modalRequestId = document.getElementById('modalRequestId');
  const modalRequestStatus = document.getElementById('modalRequestStatus');
  const modalRequestDescription = document.getElementById('modalRequestDescription');
  const modalRequestActivity = document.getElementById('modalRequestActivity');
  const modalRequestSQL = document.getElementById('modalRequestSQL');
  const runModal = document.getElementById('runModal');
  const runModalRequestId = document.getElementById('runModalRequestId');
  const runModalDescription = document.getElementById('runModalDescription');
  const runModalResults = document.getElementById('runModalResults');

  const reviewModal = document.getElementById('reviewModal');
  const reviewRequestId = document.getElementById('reviewRequestId');
  const reviewRequestStatus = document.getElementById('reviewRequestStatus');
  const reviewRequestDate = document.getElementById('reviewRequestDate');
  const reviewRequestName = document.getElementById('reviewRequestName');
  const reviewRequestQuery = document.getElementById('reviewRequestQuery');
  const reviewRequestComment = document.getElementById('reviewRequestComment');
  const downloadCSVButton = document.getElementById('downloadCSV');

  const createRequestModal = document.getElementById('createRequestModal');
  const modalRequestComment = document.getElementById('modalRequestComment');
  const modalRequestUser = document.getElementById('modalRequestUser');
  const modalRequestDateCreated = document.getElementById('modalRequestDateCreated');
  const modalRequestLastActivity = document.getElementById('modalRequestLastActivity');
  const modalRequestReviewUser = document.getElementById('modalRequestReviewUser');

  const reviewModal = document.getElementById('reviewModal');
  const reviewRequestId = document.getElementById('reviewRequestId');
  const reviewRequestStatus = document.getElementById('reviewRequestStatus');
  const reviewRequestActivity = document.getElementById('reviewRequestActivity');
  const reviewRequestUser = document.getElementById('reviewRequestActivity');
  const reviewRequestDescription = document.getElementById('reviewRequestDescription');
  const reviewRequestComment = document.getElementById('reviewRequestComment);
  const reviewRequestSQL = document.getElementById('reviewRequestSQL');

  let currentPage = 1;
  const itemsPerPage = 5;
  let requestsData = [];

  function generateID() {
    const timestamp = new Date().getTime();
    return 'SQL' + timestamp;
  }

   function formatDate() {
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();
        const formattedDate = date + ' ' + time;
        return formattedDate;
    }

  function displayRequests(pageNumber) {
        var responseClone;
        var response = fetch('/get_queries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        })
        .then(function (response){
            responseClone = response.clone();
            return response.json();
        })
        .then(function (data){
            let requestUi = requestList(data);
            document.getElementById('requestTable').append(requestUi);
        }, function (rejectionReason) {
            console.log('Error parsing JSON from response:', rejectionReason, responseClone);
            responseClone.text()
            .then(function (bodyText){
                console.log('Received the following instead of valid JSON:', bodyText);
            });
        });
    }

    function requestList(data){
        let tbody = document.createElement('tbody');
        data.forEach(function(elem) {
            var row = document.createElement('tr');
            var id = document.createElement('td');
            var status = document.createElement('td');
            status.classList.add('status');
            var description = document.createElement('td');
            var comment = document.createElement('td');
            var req = document.createElement('td');
            var activity = document.createElement('td');
            var infoButton = document.createElement('button');
            infoButton.setAttribute('type', 'button');
            infoButton.classList.add('info');
            infoButton.textContent = 'ИНФО';
            infoButton.addEventListener('click', () => {
                displayModal(elem);
            });
            var launchButton = document.createElement('button');
            launchButton.setAttribute('type', 'button');
            launchButton.classList.add('launch');
            launchButton.textContent = 'ЗАПУСК';
            launchButton.addEventListener('click', () => {
                displayRunModal(elem);
            });
            var reviewButton = document.createElement('button');
            reviewButton .setAttribute('type', 'button');
            reviewButton .classList.add('review'');
            reviewButton .textContent = 'ОБЗОР';
            reviewButton .addEventListener('click', () => {
                displayRunModal(elem);
            });

            id.textContent = elem.id;
            status.textContent = elem.status;
            description.textContent = elem.description;
            comment.textContent = elem.comment;
            req.textContent = elem.request;
            activity.textContent = elem.activity;

            row.appendChild(id);
            row.appendChild(status);
            row.appendChild(description);
            row.appendChild(comment);
            row.appendChild(req);
            row.appendChild(activity);
            row.appendChild(infoButton);
            row.appendChild(launchButton);
            row.appendChild(reviewButton);

            tbody.appendChild(row);
        });
        return tbody;

       }

   function downloadCSV() {
    fetch('/get_queries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
    },
    body: JSON.stringify({})
})
.then(response => response.json())
.then(data => {
    let csvContent = 'ID,Description\n';
    data.forEach(request => {
        csvContent += `${request.id},"${request.description}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data.csv';
    link.click();
})
.catch(error => {
    console.error('Ошибка при получении данных для CSV:', error);
});
}

    function resetCreateRequestForm() {
        document.getElementById('description').value = '';
        document.getElementById('comment').value = '';
        document.getElementById('request').value = '';
    }


//  function updateTable() {
//    const startIndex = (currentPage - 1) * itemsPerPage;
//    const endIndex = startIndex + itemsPerPage;
//    const displayData = requestsData.slice(startIndex, endIndex);
//
//    tableBody.innerHTML = '';
//    displayData.forEach(request => {
//      const row = document.createElement('tr');
//      row.innerHTML = `
//        <td>${request.id}</td>
//        <td class="status">${request.status}</td>
//        <td>${request.description}</td>
//        <td>${request.activity}</td>
//        <td><button class="info">Инфо</button></td>
//        <td><button class="launch">Запуск</button></td>
//        <td><button class="review">Обзор</button></td>
//      `;
//      tableBody.appendChild(row);
//
//      row.querySelector('.info').addEventListener('click', function() {
//        displayModal(request);
//      });
//
//      row.querySelector('.launch').addEventListener('click', function() {
//        displayRunModal(request);
//      });
//
//      row.querySelector('.review').addEventListener('click', function() {
//        displayReviewModal(request);
//      });
//    });
//  }


async function updateRequestStatus(requestId, newStatus) {
    try {
        const response = await fetch(`/update_request_status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: requestId, status: newStatus }),
        });

        if (response.ok) {
            return true;
        } else {
            console.error('Ошибка при обновлении статуса запроса:', response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Ошибка при запросе на сервер:', error);
        return false;
    }
}
    function clearModal() {
        const table = document.getElementById('requestTable');
        const rows = table.getElementsByTagName('tr');
        for (let i = rows.length - 1; i > 0; i--) {
            table.deleteRow(i);
        }
    }
//  function closeReviewModal() {
//    reviewModal.style.display = 'none';
//  }

  function downloadCSV() {
    fetch('/get_queries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        let csvContent = 'ID,Description\n';
        data.forEach(request => {
            csvContent += `${request.id},"${request.description}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.csv';
        link.click();
    })
    .catch(error => {
        console.error('Ошибка при получении данных для CSV:', error);
    });
}

  nextPageButton.addEventListener('click', function() {
    currentPage++;
    displayRequests(currentPage);
  });

  prevPageButton.addEventListener('click', function() {
    if (currentPage > 1) {
      currentPage--;
    }
    displayRequests(currentPage);
  });

  idHeader.addEventListener('click', function() {
        requestsData.sort((a, b) => a.id.localeCompare(b.id));
        clearModal();
        displayRequests(currentPage);
    });

    statusHeader.addEventListener('click', function() {
        requestsData.sort((a, b) => a.status.localeCompare(b.status));
        clearModal();
        displayRequests(currentPage);
    });

    descriptionHeader.addEventListener('click', function() {
        requestsData.sort((a, b) => a.description.localeCompare(b.description));
        clearModal();
        displayRequests(currentPage);
    });

    activityHeader.addEventListener('click', function() {
        requestsData.sort((a, b) => {
            const dateA = new Date(a.activity);
            const dateB = new Date(b.activity);
            return dateB - dateA;
        });
        clearModal();
        displayRequests(1);
    });

  createRequestButton.addEventListener('click', function() {
    var currentDate = new Date();
    var formattedDate = currentDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$1.$2.$3 ($4:$5:$6)');

    document.getElementById('username').textContent = getCookie("uid").toUpperCase();
    document.getElementById('id').textContent = generateID();
    document.getElementById('date_created').textContent = formatDate();
    document.getElementById('activity').textContent = formatDate();
    createRequestModal.style.display = 'block';
});

    closeModals.forEach(closeModal => {
            closeModal.addEventListener('click', function() {
                modal.style.display = 'none';
                runModal.style.display = 'none';
                createRequestModal.style.display = 'none';
                resetCreateRequestForm();
            });
        });

  function displayModal(request) {
    modal.style.display = 'block';
    modalRequestId.textContent = request.id;
    modalRequestStatus.textContent = request.status;
    modalRequestDescription.textContent = request.description;
    modalRequestActivity.textContent = request.activity;
    modalRequestComment.textContent = request.comment;
    modalRequestSQL.textContent = '';
  }

  function displayRunModal(request) {
    runModal.style.display = 'block';
    runModalRequestId.textContent = request.id;
    runModalDescription.textContent = request.description;
    const downloadCSVButton = document.getElementById('downloadCSV');
    downloadCSVButton.removeEventListener('click', downloadCSV);
    downloadCSVButton.addEventListener('click', downloadCSV);
  }

  closeModals.forEach(closeModal => {
    closeModal.addEventListener('click', function() {
      modal.style.display = 'none';
      runModal.style.display = 'none';
      reviewModal.style.display = 'none';
    });
  });


  function displayReviewModal(request) {
    reviewModal.style.display = 'block';
    reviewRequestId.textContent = request.id;
    reviewRequestStatus.textContent = request.status;
    reviewRequestActivity.textContent = request.activity;
    reviewRequestUser.textContent = request.user;  // TODO брать с ФИО пользователя
    reviewRequestDescription.textContent = request.description;
    reviewRequestComment.textContent = request.comment;
    reviewRequestSQL.textContent = '';

    const approveButton = reviewModal.querySelector('.approve');
    const rejectButton = reviewModal.querySelector('.reject');

    approveButton.removeEventListener('click', approveReview);
    rejectButton.removeEventListener('click', rejectReview);

    async function approveReview() {
        const newStatus = 'approved';
        const success = await updateRequestStatus(request.id, newStatus);
        if (success) {
            request.status = newStatus;
            reviewRequestStatus.textContent = newStatus;
            closeReviewModal();
            updateTable();
        } else {
            alert('Ошибка при обновлении статуса запроса');
        }
    }

    async function rejectReview() {
        const newStatus = 'rejected';
        const success = await updateRequestStatus(request.id, newStatus);
        if (success) {
            request.status = newStatus;
            reviewRequestStatus.textContent = newStatus;
            closeReviewModal();
            updateTable();
        } else {
            alert('Ошибка при обновлении статуса запроса');
        }
    }

    approveButton.addEventListener('click', approveReview);
    rejectButton.addEventListener('click', rejectReview);
}


    window.addEventListener('click', function(event) {
        if (event.target === modal) {
          modal.style.display = 'none';
        }
        if (event.target === runModal) {
          runModal.style.display = 'none';
        }
        if (event.target === reviewModal) {
          reviewModal.style.display = 'none';
        }
      });

  const createRequestForm = document.getElementById('createRequestForm');
    createRequestForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newRequest = {
            id: document.getElementById('id').textContent,
            user: document.getElementById('username').textContent,
            date_created: document.getElementById('date_created').textContent,
            last_activity: document.getElementById('activity').textContent,
            status: 'in review',
            review_user: '',
            description: document.getElementById('description').value,
            comment: document.getElementById('comment').value,
            request: document.getElementById('request').value,
            activity: new Date().toISOString()
        };
        var responseClone;
        var response = fetch('/create_request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newRequest})
        })
        .then(function (response){
            responseClone = response.clone();
            return response.json();
        })
        .then(function (data){
            const result = data;
            if(result.result == 'OK'){
                clearModal();
                displayRequests(currentPage);
                createRequestModal.style.display = 'none';
                resetCreateRequestForm();
            } else {
                window.alert("Не удалось создать запрос. " + result.result);
            }
        }, function (rejectionReason) {
            console.log('Error parsing JSON from response:', rejectionReason, responseClone);
            responseClone.text()
            .then(function (bodyText){
                console.log('Received the following instead of valid JSON:', bodyText);
            });
        });
    });

    document.getElementById('downloadCSV').addEventListener('click', downloadCSV);
});

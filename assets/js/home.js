HEROKU_LINK = "https://hidden-castle-65964.herokuapp.com/";
function script(topicsDict) {
    if (topicsDict==null) {
        topicsDict = JSON.parse(document.getElementById('topicsDict').innerText);
    }
    var totalQuestions = new Set();
    var questions = [];
    var cardElement = "";
    var listElement = "";
    var tags = Object.keys(topicsDict);
    for (var i = 0; i < tags.length; i++) {
        listElement = "";
        var headingId = "faqHeading-" + (i + 1);
        var collapseId = "faqCollapse-" + (i + 1);
        var collapseHashtag = "#faqCollapse-" + (i + 1);
        var q = 0;
        for (var j = 0; j < tags[i].length; j++) {
            if (topicsDict[tags[i]][j] == undefined) {
                continue;
            }
            totalQuestions.add(topicsDict[tags[i]][j]);
            q = q + 1;
            listElement = listElement + `<li>
        <a target="_blank" href="${topicsDict[tags[i]][j]}">${topicsDict[tags[i]][j]}</a>
    </li>`;
        }
        questions.push(q);
        cardElement = cardElement + `<div class="card">
    <div class="card-header" id="`+ headingId + `">
        <div class="mb-0">
            <h5 class="faq-title" data-toggle="collapse" data-target="`+ collapseHashtag + `"
                data-aria-expanded="true" data-aria-controls="`+ collapseId + `">
                <span class="badge">${i + 1}</span>${tags[i]}
            </h5>
        </div>
    </div>
    <div id="`+ collapseId + `" class="collapse" aria-labelledby="` + headingId + `"
        data-parent="#accordion">
        <div class="card-body">
            <ol>` + listElement + `</ol>
            </div>
        </div>
        </div>`
    }
    var accordion = document.getElementById('accordion');
    accordion.innerHTML = cardElement;
    var barElement = "";
    for (var i = 0; i < tags.length; i++) {
        var temp = (questions[i] / totalQuestions.size) * 100;
        barElement = barElement + `<div class="graph-legend">${tags[i]}</div>
    <span class="graph-barBack">
        <li class="graph-bar" data-value="`+ temp + `">
        </li>
    </span> `;
    }
    var barGraph = document.getElementsByClassName('barGraph')[0];
    barGraph.innerHTML = barElement;

    var modal = document.getElementById("myModal");
    var btn = document.getElementById("myBtn");
    var span = document.getElementsByClassName("close")[0];
    btn.onclick = function () {
        modal.style.display = "block";
    }
    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    $(document).ready(function () {
        $('.graph-bar').each(function () {
            var dataWidth = $(this).data('value');
            $(this).css("width", dataWidth + "%");
        });
    });
    $(document).ready(function () {
        $('.chart-bubble').each(function () {
            // Bubble Size
            var bubbleSize = $(this).data('value');
            $(this).css("width", function () {
                return (bubbleSize * 10) + "px"
            });
            $(this).css("height", function () {
                return (bubbleSize * 10) + "px"
            });
            var posX = $(this).data('x');
            var posY = $(this).data('y');
            $(this).css("left", function () {
                return posX - (bubbleSize * 0.5) + "%"
            });
            $(this).css("bottom", function () {
                return posY - (bubbleSize * 0.5) + "%"
            });
        });
    });
}
script(null);
var fetchDataButton = document.getElementById('fetchData');
var userIdInput = document.getElementById('userIdInput');
fetchDataButton.addEventListener('click', () => {
    var userId = userIdInput.value;
    var obj = { "userId": userId };
    var url = HEROKU_LINK + 'https://codeforces.com/contests/writer/' + userId;
    fetch(url).then(function (response) {
        return response.text();
    }).then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var flag = doc.querySelectorAll('.bottom .dark .left .right');
        if (flag && flag.innerText == 'No contests') {
            var emptyWarning = document.getElementById('emptyWarning');
            emptyWarning.style.display = 'block';
            return;
        }
        var message = doc.querySelectorAll('.message');
        if (message && message.innerText == 'No such user') {
            var invalidWarning = document.getElementById('invalidWarning');
            invalidWarning.style.display = 'block';
            return;
        }
        var lefts = doc.querySelectorAll('tr');
        var contests = [];
        for (var i = 0; i < lefts.length; i++) {
            if (lefts[i].getAttribute('data-contestid') != null) {
                contests.push(lefts[i].getAttribute('data-contestid'));
            }
        }
        var obj = { "contests": contests, "userId": userId };
        fetch(`http://localhost:8080/fetchData/${JSON.stringify(obj)}`, {
            method: "GET"
        }).then(response => response.json())
            .then((json) => {
                script(json.topicsDict);
            });
        // window.location.href = `http://localhost:8080/fetchData/${JSON.stringify(obj)}`;
    }).catch(function (err) {
        console.log(err);
    });
});
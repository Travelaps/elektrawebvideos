var videoList = [];
var datam = fetch(
  "https://raw.githubusercontent.com/Travelaps/elektrawebvideos/main/data.json"
)
  .then((response) => response.json())
  .then((data) => {
    var html = "";
    var totalLessons = 0;
    var totalTime = 0;
    for (let i = 0; i < data.length; i++) {
      if (i == 0) {
        var show = "show";
      } else {
        var show = "";
      }

      var videoLinks = "";
      var videosTimes = 0;
      for (let index = 0; index < data[i].videos.length; index++) {
        if (data[i].videos[index].videoDescription) {
          var showDesc = "showinline";
        } else {
          var showDesc = "hide";
        }

        videoLinks += `
          <li>
                <div  class="list-item">
                  <span  data-video="${
                    data[i].videos[index].youtubeVideoID
                  }" onclick="showVideo(this);" class="playIcon svgSize"></span>
                  <div class="item-content">
                    <span class="firstItem"><span  data-video="${
                      data[i].videos[index].youtubeVideoID
                    }" onclick="showVideo(this);" >${
          data[i].videos[index].videoName
        }</span>
                    <span onclick="showDesc('sec${i}part${index}');" class="${showDesc}"><span id="chevron_${
          "sec" + i + "part" + index
        }" class="expandDown svgSize"></span></span>
                    </span>
                    <span class="item-time">${
                      data[i].videos[index].videoTime
                    }</span>
                  </div>
                </div>
                <div class="descArea" id="desc_${"sec" + i + "part" + index}">${
          data[i].videos[index].videoDescription
        }</div>

              </li>
          `;

        videosTimes = videosTimes + data[i].videos[index].videoIntTime;
      }

      html += `
        <div class="section-panel">
          <div class="section-header firtPanel">
            <span class="expandDown svgSize"></span>
            <h3 class="item-content">
              <span class="firstItem heading">${data[i].videoGrup}</span
              ><span class="item-time">${
                data[i].videos.length
              } ders  ${Math.ceil(videosTimes)} dak</span>
            </h3>
          </div>
          <div class="section-content ${show}">
            <ul>
             ${videoLinks}
            </ul>
          </div>
        </div>
        `;
      totalLessons = totalLessons + data[i].videos.length;
      totalTime = totalTime + videosTimes;
    }
    document.getElementById("videoContent").innerHTML = html;

    var items = document.querySelectorAll(".section-header");
    for (let index = 0; index < items.length; index++) {
      items[index].addEventListener("click", function () {
        if (items[index].parentElement.children[1].classList.contains("show")) {
          items[index].parentElement.children[1].classList.remove("show");

          items[index].children[0].classList.remove("svgAnimation");
          items[index].children[0].classList.add("svgAnimationBack");
        } else {
          items[index].parentElement.children[1].classList.add("show");
          items[index].children[0].classList.add("svgAnimation");
          items[index].children[0].classList.remove("svgAnimationBack");
        }
      });
    }

    document.getElementById("courseInfo").innerHTML =
      data.length +
      " bölüm • " +
      totalLessons +
      " ders • " +
      display(totalTime);

    datam.then((data) => {
      data.forEach((element) => {
        element["videos"].forEach((videos) => {
          videoList.push(videos);
        });
      });
    });

    return data;
  });

function display(a) {
  var hours = Math.trunc(a / 60);
  var minutes = a % 60;
  return hours + " saat " + Math.ceil(minutes) + " dak";
}

function colapseAllHide(event) {
  var items = document.querySelectorAll(".section-header");
  for (let index = 0; index < items.length; index++) {
    items[index].parentElement.children[1].classList.remove("show");
    items[index].children[0].classList.remove("svgAnimation");
    items[index].children[0].classList.add("svgAnimationBack");
  }
  document.getElementById("colapseAllHide").style.display = "none";
  document.getElementById("colapseAllExpand").style.display = "block";
}

function colapseAllExpand(event) {
  var items = document.querySelectorAll(".section-header");
  for (let index = 0; index < items.length; index++) {
    items[index].parentElement.children[1].classList.add("show");
    items[index].children[0].classList.add("svgAnimation");
    items[index].children[0].classList.remove("svgAnimationBack");
  }
  document.getElementById("colapseAllHide").style.display = "block";
  document.getElementById("colapseAllExpand").style.display = "none";
}

function showVideo(e) {
  document.getElementsByTagName("body")[0].classList.add("overflowHidden");
  document.getElementById("videoPlugin").style.display = "flex";

  var videoHtml =
    '<iframe class="videoFrame" allowfullscreen frameborder="0" scrolling="no" marginheight="0" marginwidth="0" type="text/html" src="https://www.youtube.com/embed/' +
    e.dataset.video +
    '?autoplay=1"></iframe>';

  document.getElementById("videoPlay").innerHTML = videoHtml;
}

function closeVideo() {
  document.getElementById("videoPlugin").style.display = "none";
  document.getElementById("videoPlay").innerHTML = "";
  document.getElementsByTagName("body")[0].classList.remove("overflowHidden");
}

function showDesc(index) {
  if (document.getElementById("desc_" + index).classList.contains("show")) {
    document.getElementById("desc_" + index).classList.remove("show");
    document
      .getElementById("chevron_" + index)
      .classList.remove("svgAnimation");
    document
      .getElementById("chevron_" + index)
      .classList.add("svgAnimationBack");
  } else {
    document.getElementById("desc_" + index).classList.add("show");
    document.getElementById("chevron_" + index).classList.add("svgAnimation");
    document
      .getElementById("chevron_" + index)
      .classList.remove("svgAnimationBack");
  }
}

document.getElementById("search").addEventListener("keyup", function () {
  if (this.value == "") {
    document.getElementById("searchList").innerHTML = "";
    document.getElementById("searchArea").style.display = "none";
    return false;
  }

  a = videoList;
  term = this.value.toLowerCase();
  b = a.filter((item) => item["videoName"].toLowerCase().indexOf(term) > -1);

  if (b.length > 0) {
    document.getElementById("searchArea").style.display = "block";
  } else {
    document.getElementById("searchList").innerHTML =
      "<strong>Sonuç Bulunamadı</strong>";
    return false;
  }


  videoListHtml = "";

  b.forEach((element, index) => {
    if (element.videoDescription) {
      var showDesc = "showinline";
    } else {
      var showDesc = "hide";
    }

    videoListHtml += `
<li>
      <div  class="list-item">
        <span  data-video="${
          element.youtubeVideoID
        }" onclick="showVideo(this);" class="playIcon svgSize"></span>
        <div class="item-content">
          <span class="firstItem"><span  data-video="${
            element.youtubeVideoID
          }" onclick="showVideo(this);" >${element.videoName}</span>
          <span onclick="showDesc('sec${index}part${index}');" class="${showDesc}"><span id="chevron_${
      "sec" + index + "part" + index
    }" class="expandDown svgSize"></span></span>
          </span>
          <span class="item-time">${element.videoTime}</span>
        </div>
      </div>
      <div class="descArea" id="desc_${"sec" + index + "part" + index}">${
      element.videoDescription
    }</div>

    </li>
`;
  });

  document.getElementById("searchList").innerHTML = videoListHtml;
});

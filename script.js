const videoContainer = document.querySelector(".video-container");

let api_Key = "AIzaSyCgpUKcX_vlG3P7SgI4MxsAQH5LWHFYuiU";
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";

fetch(
  video_http +
    new URLSearchParams({
      key: api_Key,
      part: "snippet",
      chart: "mostPopular",
      maxResults: 50,
      regionCode: "IN",
    })
)
  .then((res) => res.json())
  .then((data) => {
    data.items.forEach((item) => {
      getChannelIcon(item);
    });
  })
  .catch((err) => console.log(err));

const getChannelIcon = (video_data) => {
  fetch(
    channel_http +
      new URLSearchParams({
        key: api_Key,
        part: "snippet",
        id: video_data.snippet.channelId,
      })
  )
    .then((res) => res.json())
    .then((data) => {
      video_data.channelThumbnail =
        data.items[0].snippet.thumbnails.default.url;
      makeVideoCard(video_data);
    });
};

const makeVideoCard = (data) => {
  videoContainer.innerHTML += `
    <div class="video"   onclick="redirectToVideoPage('${data.id}', '${data.snippet.title}', '${data.snippet.channelTitle}', '${data.channelThumbnail}')"">
    <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" />
    <div class="content">
        <img src="${data.channelThumbnail}" class="channel-icon" />
        <div class="info">
            <h4 class="title"> ${data.snippet.title}</h4>
            <p class="channel-name">${data.snippet.channelTitle}</p>
            <p class="views">15K Views .1 week ago</p>
        </div>
    </div>
</div>  `;
};

const redirectToVideoPage = (
  videoId,
  videoTitle,
  channelTitle,
  channelThumbnail
) => {
  window.location.href = `videoDetails.html?videoId=${videoId}&videoTitle=${videoTitle}&channelTitle=${channelTitle}&channelThumbnail=${channelThumbnail}`;
};

//search bar

const searchInput = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");

let searchLink = "https://youtube.com/results?search_query=";
searchBtn.addEventListener("click", () => {
  if (searchInput.value.length) {
    location.href = searchLink + searchInput.value;
  }
});

// Fetch and update video data
const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get("videoId");
const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${api_Key}`;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "360",
    width: "780",
    videoId: videoId,
  });
}

fetch(videoUrl)
  .then((response) => response.json())
  .then((data) => {
    const videoData = data.items[0];

    const title = videoData.snippet.channelTitle;
    const viewCount = videoData.statistics.viewCount;
    const likeCount = videoData.statistics.likeCount;
    const dislikeCount = videoData.statistics.dislikeCount;
    const channelTitle = videoData.snippet.channelTitle;
    const channelSubscribers = videoData.statistics.subscriberCount;
    const description = videoData.snippet.description;
    const commentCount = videoData.statistics.commentCount;

    const likeIcon = document.createElement("i");
    likeIcon.classList.add("fa-regular", "fa-thumbs-up");
    likeIcon.style.color = "#ffffff";
    likeIcon.style.marginRight = "3px";

    const dislikeIcon = document.createElement("i");
    dislikeIcon.classList.add("fa-regular", "fa-thumbs-down");
    dislikeIcon.style.color = "#ffffff";
    dislikeIcon.style.marginRight = "3px";

    // Update HTML elements
    document.querySelector(".title2").innerText = title;
    document.querySelector(".likeBtn p").innerText = `${viewCount} views`;
    document.querySelector(".flex p:nth-child(1)").innerText = `${likeCount}`;
    document.querySelector(
      ".flex p:nth-child(2)"
    ).innerText = `${dislikeCount}`;
    document.querySelector(".name").innerText = channelTitle;
    document.querySelector(
      ".channel-name p:nth-child(2)"
    ).innerText = `${channelSubscribers} subscribers`;
    document.querySelector(".about-ch p").innerText = description;
    document.querySelector(
      ".comment-count p:nth-child(1)"
    ).innerText = `${commentCount} Comments`;
  })
  .catch((error) => console.error("Error:", error));

const sideVideoContainer = document.querySelector(".right-sidebar");

// Fetch related videos or more videos
fetch(
  video_http +
    new URLSearchParams({
      key: api_Key,
      part: "snippet",
      chart: "mostPopular",
      maxResults: 20,
      regionCode: "IN",
    })
)
  .then((res) => res.json())
  .then((data) => {
    data.items.forEach((item) => {
      const title = item.snippet.title;
      const channelTitle = item.snippet.channelTitle;
      const thumbnail = item.snippet.thumbnails.default.url;
      sideVideoContainer.innerHTML += `
                <div class="side_video_list">
                    <a href="" class="small-thumbnail"><img src="${thumbnail}" alt=""></a>
                    <div class="vid-info">
                        <a href="">${title}</a>
                        <p>${channelTitle}</p>
                    </div>
                </div>
            `;
    });
  })
  .catch((err) => console.error(err));

// Fetch video comments
const commentsUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=AIzaSyCgpUKcX_vlG3P7SgI4MxsAQH5LWHFYuiU`;

fetch(commentsUrl)
  .then((response) => response.json())
  .then((data) => {
    const comments = data.items;
    const publicCommentsContainer = document.querySelector(".public-comments");

    comments.forEach((comment) => {
      const commentText = comment.snippet.topLevelComment.snippet.textDisplay;
      const commentAuthor =
        comment.snippet.topLevelComment.snippet.authorDisplayName;
      const profileImageUrl =
        comment.snippet.topLevelComment.snippet.authorProfileImageUrl;

      // Create comment elements
      const commentElement = document.createElement("div");
      commentElement.classList.add("comment");
      commentElement.innerHTML = `
      <img src="${profileImageUrl}" class="profile-image">
        <p class="author">${commentAuthor}</p>
        <p class="text">${commentText}</p>
      `;
      publicCommentsContainer.appendChild(commentElement);
    });
  })
  .catch((error) => console.error("Error:", error));

let description =
  "Chris Fisher, also known as the Blind Woodturner, learned his craft by listening to hundreds of hours of YouTube videos and experimenting in his workshop. Now he’s a YouTube creator himself, sells his products worldwide, and does demonstrations all around the country.";
const MAX_DESCRIPTION_LENGTH = 200; // Customize the maximum length

const showMoreLink = document.getElementById("showMoreLink");
const descriptionText = document.getElementById("descriptionText");

if (description.length > MAX_DESCRIPTION_LENGTH) {
  descriptionText.innerText = `${description.slice(
    0,
    MAX_DESCRIPTION_LENGTH
  )}...`;
} else {
  showMoreLink.style.display = "none";
}

let isExpanded = false;

function showMore(event) {
  event.preventDefault();
  isExpanded = !isExpanded;
  if (isExpanded) {
    showMoreLink.innerText = "Show more";
    descriptionText.innerText = description;
  } else {
    showMoreLink.innerText = "Show less";
    descriptionText.innerText = `${description.slice(
      0,
      MAX_DESCRIPTION_LENGTH
    )}...`;
  }
}

showMoreLink.addEventListener("click", showMore);

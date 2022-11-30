/* javascript */

const sentenceStarters = ['I hate your', 'I hate it when', 'You are so stupid',
  'I cannot believe they let', 'Why should we let you', 'I hate you',
  "You just couldn't help yourself", "Just quit", 'You should just stop',
  'Who cares about you anyway', "I don't care about your",
  "You suck at your job, you should just quit", "Why keep trying, you're not even good"
];

let comment;
let score;
let inputNegativity;


async function query(data) {

  const response = await fetch(
    "https://api-inference.huggingface.co/models/CommunityLM/republican-twitter-gpt2", {
      headers: {
        Authorization: `Bearer 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`
      },
      method: "POST",
      body: JSON.stringify(data)
    }
  );

  comment = await response.json();

  if(response.ok) {
    comment = comment[0].generated_text;
    console.log('ok');
  } else {
    comment = "Something went wrong, please reload the page";
  }

  $("#comment").text(comment);

  score = await rate({
    inputs: comment
  });

  return comment;
}

async function rate(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment", {
      headers: {
        Authorization: `Bearer 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`
      },
      method: "POST",
      body: JSON.stringify(data)
    }
  );

  let rating = await response.json();
  rating = Math.round(rating[0][0].score * 100);
  console.log(rating);
  return rating;
}

$(document).ready(function() {
  $("#newComment").click(async function() {
    // await response
    let random = Math.floor(Math.random() * sentenceStarters.length);
    comment = await query({
      inputs: sentenceStarters[random]
    });

    $("#form1").show();
    $("#responseText").hide();
    $("#newComment").hide();
    // because we use "await" ^ we know that data was returned successfully
  });

  $("#newComment").trigger("click");
});

$("#form1").submit(function(e) {
  e.preventDefault();
  inputNegativity = $("#negativityInput").val();
  console.log(inputNegativity);

  $("#form1").hide();
  $("#responseText").show();
  $("#responseText").text("The API gave this tweet a negativity score of " + score + ", which has a difference of " +
  (Math.abs(score-inputNegativity)) + " from your perceived negativity. You have the choice to keep or delete this tweet:");
  $("#form2").show();
});

$("#keepBtn").click(async function() {
  $("#form2").hide();
  console.log("keep");

  if(score > 80) {
    $("#responseText").text(`While you have decided to keep this tweet, the API would have flagged this tweet for review
    and potential deletion.`);
  } else {
    $("#responseText").text(`You have decided to keep this tweet, the API has also determined that this tweet
      does not contain highly negative sentiment.`);
  }

  $("#newComment").show();
});

$("#deleteBtn").click(async function() {
  $("#form2").hide();
  console.log("delete");

  if(score < 80) {
    $("#responseText").text(`While you have decided to delete this tweet, the API would not have flagged this particular tweet,
      though it may have incorrectly assessed the sentiment.`);
  } else {
    $("#responseText").text(`You have decided to delete this tweet, the API has also determined that this tweet
       contains highly negative sentiment.`);
  }

  $("#newComment").show();
});

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
      $("#arrow").removeClass("fa-angle-up");
      $("#arrow").addClass("fa-angle-down");
    } else {
      content.style.display = "block";
      $("#arrow").removeClass("fa-angle-down");
      $("#arrow").addClass("fa-angle-up");
    }

  });
}

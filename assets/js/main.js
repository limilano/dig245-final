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
  comment = comment[0].generated_text;

  $("#comment").text(comment);
  score = await rate({
    inputs: comment
  });
  // $("#score").text("Score: " + score);
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
  $("#responseText").text("You have decided to keep this tweet");
  $("#newComment").show();
});

$("#deleteBtn").click(async function() {
  $("#form2").hide();
  console.log("delete");
  $("#responseText").text("You have decided to delete this tweet");
  $("#newComment").show();
});

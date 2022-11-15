/* javascript */

const sentenceStarters = ['I hate your', 'I hate it when', 'You are so stupid',
  'I cannot believe they let', 'Why should we let you', 'I hate you',
  "You just couldn't help yourself", "Just quit", 'You should just stop',
  'Who cares about you anyway', "I don't care about your",
  "You suck at your job, you should just quit", "Why keep trying, you're not even good"
];

let comment;
let score;

async function query(data) {

  const response = await fetch(
    "https://api-inference.huggingface.co/models/gpt2", {
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
  $("#score").text("Score: " + score);
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
  $("button").click(async function() {
    // await response
    let random = Math.floor(Math.random() * sentenceStarters.length);
    comment = await query({
      inputs: sentenceStarters[random]
    });

    // because we use "await" ^ we know that data was returned successfully
  });
  $("button").trigger("click");
});

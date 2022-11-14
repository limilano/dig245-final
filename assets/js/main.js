/* javascript */

const sentenceStarters = ['I hate', 'I hate it when', 'I dislike', 'You are wrong because',
  'I cannot believe', 'Why should we let you', 'Why do they let people just',
  'When will', "Why can't", 'When will they', 'Who cares', "I don't care"
];

let comment;
let score;

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
  rating = Math.round(rating[0][0].score*100);
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
    console.log(comment);
  });
  $("button").trigger("click");
});

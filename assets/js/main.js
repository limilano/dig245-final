
/* javascript */

const sentenceStarters = ['I hate', 'I hate it when', 'I dislike', 'You are wrong because',
                          'I cannot believe', 'Why should we let you', 'Why do they let people just',
                          'When will', "Why can't", 'When will they', 'Who cares', "I don't care"];

async function query(data) {

  let comment;

    const response = await fetch(
        "https://api-inference.huggingface.co/models/CommunityLM/republican-twitter-gpt2",
        {
            headers: { Authorization: `Bearer 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` },
            method: "POST",
            body: JSON.stringify(data),
        }
    );

    comment = await response.json();
    comment = comment[0].generated_text;
    $("#comment").text(comment);
    return comment;
}

// query({inputs:sentenceStarters[0]}).then((response) => {
//     console.log(JSON.stringify(response));


    $(document).ready(function () {
    	$("button").click(async function () {
    		// await response
        let random = Math.floor(Math.random() * sentenceStarters.length);
    		let comment = await query({inputs:sentenceStarters[random]});

    		// because we use "await" ^ we know that data was returned successfully
    		console.log(comment);
    	});
    	$("button").trigger("click");
});

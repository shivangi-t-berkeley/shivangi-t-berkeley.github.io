const puzzles = [
    {
        id: 1,
        date: "2026-03-18",
        title: "Case File 01: The Del Frisco's Witness Table",
        narrative: "A source swears three witnesses met under the chandeliers at Del Frisco's just before the city desk went dark. The problem is that each witness came from a different neighborhood, ordered a different comfort meal, and left behind a different version of the truth. Your reporter has one shot to pin the story down before someone lawyers up.",
        people: ["Marcus", "Diane", "Yusuf"],
        categories: [
            {
                id: "neighborhood",
                label: "Neighborhood",
                items: ["Fishtown", "Passyunk", "Chestnut Hill"]
            },
            {
                id: "order",
                label: "Order",
                items: ["Cheesesteak", "Hoagie", "Soft Pretzel"]
            }
        ],
        clues: [
            { id: 1, text: "Marcus doesn't live in Fishtown." },
            { id: 2, text: "The person who orders the soft pretzel lives in Chestnut Hill." },
            { id: 3, text: "Diane's favorite order is not the hoagie." },
            { id: 4, text: "Yusuf lives in Passyunk." },
            { id: 5, text: "The Fishtown regular always gets the cheesesteak." },
            { id: 6, text: "Marcus has never been to Passyunk in his life." }
        ],
        minimumSolvableClues: 4,
        solution: {
            Marcus: { neighborhood: "Chestnut Hill", order: "Soft Pretzel" },
            Diane: { neighborhood: "Fishtown", order: "Cheesesteak" },
            Yusuf: { neighborhood: "Passyunk", order: "Hoagie" }
        }
    },
    {
        id: 2,
        date: "2026-03-19",
        title: "Case File 02: The Reading Terminal Exchange",
        narrative: "At the lunch rush, a handoff vanished into Reading Terminal Market. Three regulars crossed paths, each visiting a different stall and leaving with a different lunch. One of them saw more than they should have, and your notes have to identify who before the trail disappears into the crowd.",
        people: ["Asha", "Tommy", "Reina"],
        categories: [
            {
                id: "stall",
                label: "Stall",
                items: ["DiNic's", "Miller's Twist", "Beck's Cajun Cafe"]
            },
            {
                id: "lunch",
                label: "Lunch",
                items: ["Roast Pork", "Pretzel Dog", "Jambalaya"]
            }
        ],
        clues: [
            { id: 1, text: "Tommy skipped DiNic's today." },
            { id: 2, text: "The Miller's Twist regular grabbed the pretzel dog." },
            { id: 3, text: "Reina did not order jambalaya." },
            { id: 4, text: "Asha went straight to Beck's Cajun Cafe." },
            { id: 5, text: "Whoever hit DiNic's ordered the roast pork." },
            { id: 6, text: "Tommy says a pretzel dog counts as a full lunch, somehow." }
        ],
        minimumSolvableClues: 4,
        solution: {
            Asha: { stall: "Beck's Cajun Cafe", lunch: "Jambalaya" },
            Tommy: { stall: "Miller's Twist", lunch: "Pretzel Dog" },
            Reina: { stall: "DiNic's", lunch: "Roast Pork" }
        }
    },
    {
        id: 3,
        version: 2,
        date: "2026-03-20",
        title: "Case File 03: Smoke Over the South Lot",
        narrative: "Hours before kickoff, a tipster called in from the tailgate lots outside the Linc. Three fans held the same patch of asphalt, each in a different jersey and each working a different grill. Somewhere in that smoke is the account your reporter needs to publish before the stadium drowns it out.",
        people: ["Nina", "Cal", "Omar"],
        categories: [
            {
                id: "jersey",
                label: "Jersey",
                items: ["Kelce", "Hurts", "Dawkins"]
            },
            {
                id: "grill",
                label: "Grill",
                items: ["Sausage", "Wings", "Burgers"]
            }
        ],
        clues: [
            { id: 1, text: "Omar wasn't wearing the Kelce jersey." },
            { id: 2, text: "The Dawkins fan brought wings." },
            { id: 3, text: "Nina refused to grill burgers before noon." },
            { id: 4, text: "Cal showed up in the Hurts jersey." },
            { id: 5, text: "The Kelce jersey belonged to the one with sausage on the grill." },
            { id: 6, text: "Omar says wings beat burgers every single time." }
        ],
        minimumSolvableClues: 4,
        solution: {
            Nina: { jersey: "Kelce", grill: "Sausage" },
            Cal: { jersey: "Hurts", grill: "Burgers" },
            Omar: { jersey: "Dawkins", grill: "Wings" }
        }
    }
];

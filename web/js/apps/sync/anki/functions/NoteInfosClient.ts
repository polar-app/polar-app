// Returns a list of objects containing for each note ID the note fields, tags, note type and the cards belonging to the note.
//
//     Sample request:
//
// {
//     "action": "notesInfo",
//     "version": 6,
//     "params": {
//     "notes": [1502298033753]
// }
// }
// Sample result:
//
// {
//     "result": [
//     {
//         "noteId":1502298033753,
//         "modelName": "Basic",
//         "tags":["tag","another_tag"],
//         "fields": {
//             "Front": {"value": "front content", "order": 0},
//             "Back": {"value": "back content", "order": 1}
//         }
//     }
// ],
//     "error": null
// }

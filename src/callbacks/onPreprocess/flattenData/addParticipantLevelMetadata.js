export default function addParticipantLevelMetadata(d, participant_obj) {
    this.varList.forEach(function(v) {
        participant_obj[v] = d[0][v];
        participant_obj.level = 'participant';
    });
}

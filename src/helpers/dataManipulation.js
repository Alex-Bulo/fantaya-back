
function assignLineups(teams, squads, fixture) {
    // Define required slots for each lineup category
    const lineupConfig = {
        Titular: { Equipo: 1, Arq: 1, Def: 4, Med: 3, Del: 3 },
        Suplente: { Equipo: 1, Arq: 1, Def: 1, Med: 1, Del: 1 }
    };

    // Create final lineup array
    const result = [];

    teams.forEach((teamId) => {

        const teamPlayers = squads.filter((p) => p.idTeam === teamId).map(p=>{
            return {
                ...p.dataValues,
                player: p.dataValues.player.dataValues
            }
        })
        
        // Prepare lineup groups
        const assignedPlayers = { Titular: [], Suplente: [], NoConvocado: [] };

        // Function to assign players to a lineup category based on position
        const assignPlayersToLineup = (lineupType) => {
            const config = lineupConfig[lineupType];
            Object.keys(config).forEach((position) => {
                const requiredCount = config[position];
                const players = teamPlayers.filter(
                    (p) => p.player.position === position && !assignedPlayers.Titular.includes(p) && !assignedPlayers.Suplente.includes(p)
                ).slice(0, requiredCount);

                // Push selected players into the respective lineup type
                assignedPlayers[lineupType].push(...players);
            });
        };

        // Assign titular and suplente players
        assignPlayersToLineup("Titular");
        assignPlayersToLineup("Suplente");

        // Identify No Convocado players
        assignedPlayers.NoConvocado = teamPlayers.filter(
            (p) => !assignedPlayers.Titular.includes(p) && !assignedPlayers.Suplente.includes(p)
        );

        // Format output for this team
        ["Titular", "Suplente", "NoConvocado"].forEach((lineup) => {
            assignedPlayers[lineup].forEach((player) => {
                result.push({
                    idFixture: fixture,
                    idPlayer: player.idPlayer,
                    // position: player.player.position,
                    idTeam: player.idTeam,
                    eventsFantapoints: '',
                    defensorDesignado: '',
                    ddPoints: '',
                    captain: '',
                    captainPoints: '',
                    lineup: lineup==='NoConvocado'? 'No Convocado':lineup,
                    totalFantapoints:''
                });
            });
        });
    });

    return result;
}

module.exports = {assignLineups:assignLineups}
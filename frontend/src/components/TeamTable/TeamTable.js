import { Fragment, useState } from "react";
import "./TeamTable.css"
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid, TextField } from "@mui/material";
import TeamRow from "../TeamRow/TeamRow";
import AddTeamForm from "../AddTeamForm/AddTeamForm";
import EditTeamForm from "../EditTeamForm/EditTeamForm";
import SearchBar from "../SearchBar/SearchBar";

export default function TeamTable({ teamsList }) {
    const [originalTeams, setOriginalTeams] = useState(teamsList)
    const [teams, setTeams] = useState(teamsList);
    const [isAddingTeam, setIsAddingTeam] = useState(false);
    const [editTeam, setEditTeam] = useState(null);
    const [editTeamName, setEditTeamName] = useState(null);
    const [newTeam, setNewTeam] = useState({ name: '', region: '', players: [{ id: 1, name: '', position: '', kda: 0 }] });

    const handleAddingTeam = () => {
        setIsAddingTeam(!isAddingTeam);
    }

    const handleDeleteTeam = (teamId) => {
        const newTeams = teams.filter(team => team.id !== teamId)
        setTeams(newTeams)
        setOriginalTeams(newTeams)
    }

    const handleEditTeam = (teamId) => {
        const selectedTeamToEdit = teams.find((team) => team.id === teamId)
        setEditTeamName(selectedTeamToEdit.name)
        setEditTeam(selectedTeamToEdit)
    }

    const handleSaveEdit = (event) => {
        event.preventDefault();
        const index = teams.findIndex(team => team.id === editTeam.id)
        const newEditedTeams = [...teams]
        newEditedTeams[index] = editTeam
        setTeams(newEditedTeams)
        setOriginalTeams(newEditedTeams)
        setEditTeamName(null)
        setEditTeam(null)
    }

    const handleEditFieldChange = (e) => {
        const { name, value } = e.target;
        setEditTeam((prevEditTeam) => ({
            ...prevEditTeam, [name]: value
        }))
    }

    const handleEditPlayerChange = (e, playerId) => {
        const { name, value } = e.target;
        const playerToUpdateIndex = editTeam.players.findIndex(player => player.id === playerId)
        const updatedPlayers = [...editTeam.players];

        updatedPlayers[playerToUpdateIndex] = {
            ...updatedPlayers[playerToUpdateIndex],
            [name]: value
        };

        setEditTeam(prevEditTeam => ({
            ...prevEditTeam,
            players: updatedPlayers
        }));
    }

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setNewTeam((prevTeam) => ({
            ...prevTeam,
            [name]: value,
        }));
    };

    const handlePlayerAddChange = (e) => {
        // TODO: proper logic for mutiple player additions
        // note: [name] <=> field we are changing
        const { name, value } = e.target;
        setNewTeam(prevTeam => ({
            ...prevTeam,
            players: [{
                ...prevTeam.players[0],
                [name]: value
            }]
        }));
    }


    const handleAddTeam = (event) => {
        event.preventDefault();
        const newTeamWithId = { ...newTeam, id: Math.max(...teams.map(team => team.id)) + 1 }
        setTeams([...teams, newTeamWithId])
        setOriginalTeams([...teams, newTeamWithId])
        setIsAddingTeam(false)
        setNewTeam({ name: '', region: '', players: [{ id: 1, name: '', position: '', kda: '' }] })
    }

    const handleSearch = (event) => {
        const { value } = event.target
        setTeams(originalTeams)
        const filteredTeams = originalTeams.filter(team => team.region.toLowerCase().match(value.toLowerCase()))
        setTeams(filteredTeams)
    }

    return (
        <>
            <Paper elevation={14}>
                <Typography variant="h3" gutterBottom>Esports teams</Typography>
            </Paper>

            <TableContainer component={Paper} elevation={14}>
                <Table className="team-table-style">
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold" }}>Logo</Typography></TableCell>
                            <TableCell><Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold" }}>Team Name</Typography></TableCell>
                            <TableCell><Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold" }}>Region</Typography></TableCell>
                            <TableCell><Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold" }}>Actions</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={10} align="center">
                                <SearchBar onSearch={handleSearch} />
                            </TableCell>
                        </TableRow>
                        {teams.map((team) => (
                            <TeamRow key={team.id} team={team} onEdit={handleEditTeam} onDelete={handleDeleteTeam} />
                        ))}
                        {
                            isAddingTeam ? (
                                <AddTeamForm
                                    newTeam={newTeam}
                                    onSubmit={handleAddTeam}
                                    onFormChange={handleAddChange}
                                    onCancel={() => setIsAddingTeam(false)} 
                                    onPlayerFormChange={handlePlayerAddChange}/>
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} align="center">
                                        <Button variant="contained" onClick={() => handleAddingTeam()}>Add new team</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                        {
                            editTeam && <EditTeamForm
                                editTeam={editTeam}
                                editTeamNameCopy={editTeamName}
                                onSubmit={handleSaveEdit}
                                onFormChange={handleEditFieldChange}
                                onPlayerFormChange={handleEditPlayerChange}
                                onCancel={() => { setEditTeam(null) }} />
                        }

                    </TableBody>
                </Table>
            </TableContainer>

        </>
    );
}
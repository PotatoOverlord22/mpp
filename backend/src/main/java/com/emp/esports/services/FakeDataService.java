package com.emp.esports.services;

import com.emp.esports.models.entities.Player;
import com.emp.esports.models.entities.Team;
import com.emp.esports.models.exceptions.BadField;
import com.emp.esports.models.exceptions.NotFound;
import com.emp.esports.utils.Converter;
import com.emp.esports.utils.Randomizer;
import com.github.javafaker.Faker;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static org.aspectj.runtime.internal.Conversions.floatValue;

@Service
public class FakeDataService {
    private final TeamService teamService;
    private final PlayerService playerService;
    private final Faker faker;

    public FakeDataService(TeamService teamService, PlayerService playerService) {
        this.teamService = teamService;
        this.playerService = playerService;
        faker = new Faker();
    }

    @Scheduled(fixedDelay = 20000, initialDelay = 10000) // Execute every 20 seconds with an initial delay of 10 seconds
    public void addFakeTeamsScheduled() {
        addHugeAmountOfFakeTeams();
    }

    public void addFakeTeam() {
        Team fakeTeam = generateFakeTeam();
        try {
            Team addedTeam = teamService.addTeam(Converter.convertTeamToAddTeamDTO(fakeTeam));
            System.out.println("Successfully added fake team: " + addedTeam);
        } catch (BadField error) {
            System.out.println("Failed adding fake team: " + error);
        }
    }

    @Scheduled(fixedDelay = 10000, initialDelay = 5000) // Execute every 10 seconds with an initial delay of 5 seconds
    public void addFakePlayersScheduled() {
        addHugeAmountOfFakePlayers();
    }

    public void addFakePlayer() {
        Player fakePlayer = generateFakePlayer();
        try {
            Integer existingTeamId = teamService.getRandomExistingId();
            Player addedPlayer = playerService.addNewPlayerToTeam(Converter.convertPlayerToAddPlayerDTO(fakePlayer, existingTeamId));
            System.out.println("Successfully added fake player with id: " + addedPlayer.getId() + " and name: " + addedPlayer.getName() + " to team: " + teamService.getTeamById(existingTeamId).getName());
        } catch (NotFound error) {
            System.out.println("Failed adding fake player: " + error);
        }
    }

    public void addHugeAmountOfFakePlayers() {
        List<Player> playersToAdd = new ArrayList<>();
        int numberOfPlayersToAdd = 10000;
        for (int i = 0; i < numberOfPlayersToAdd; ++i)
            playersToAdd.add(generateFakePlayer());
        playerService.savePlayers(playersToAdd);
    }

    public void addHugeAmountOfFakeTeams() {
        List<Team> teamsToAdd = new ArrayList<>();
        int numberOfTeamsToAdd = 10000;
        for (int i = 0; i < numberOfTeamsToAdd; ++i)
            teamsToAdd.add(generateFakeTeam());
        teamService.saveTeams(teamsToAdd);
    }

    public void addLargeAmountOfFakeData() {
        int numberOfTeamsToAdd = 5000;
        int numberOfPlayersToAdd = 5000;
        while (numberOfTeamsToAdd > 0) {
            addFakeTeam();
            numberOfTeamsToAdd--;
        }
        while (numberOfPlayersToAdd > 0) {
            addFakePlayer();
            numberOfPlayersToAdd--;
        }
    }


    public Player generateFakePlayer() {
        String name = faker.esports().player();
        float kda = floatValue(faker.number().randomDouble(6, 0, 5));
        String position = Randomizer.getRandomPosition();
        Player fakePlayer = Player.builder()
                .name(name)
                .kda(kda)
                .position(position)
                .build();
        // System.out.println("Generated fake player: " + fakePlayer);
        return fakePlayer;
    }

    public Team generateFakeTeam() {
        String teamName = faker.esports().team();
        String logoUrl = faker.internet().image();
        String region = faker.address().country();
        Team fakeTeam = Team.builder()
                .name(teamName)
                .logoUrl(logoUrl)
                .region(region)
                .players(new ArrayList<>())
                .build();
        // System.out.println("Generated fake team: " + fakeTeam);
        return fakeTeam;
    }
}

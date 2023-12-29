# dice-roller-app
Dice Roller app

This app is a tool that simulates different dice rolls in the context of TTRPG games
The idea is to make this tool adapt to whatever system, rules, checks, rolls we use within these games

So whatever we can create this is supposed to be able to simulate and automatize
For now we have a simple command syntax that enables to parse rolls like

3D6R=1>3
which means
roll 3D6
Reroll any 1s
From the result count how many are over 3

So if we get
1 5 2 in the first roll
we should reroll 1 die and we could get 3
ending up with 3 5 2, from those only 5 is over 3 so the final result is 1

In order to visualize the dice rolls the idea is to simulate 3D dice
The 3D simulation will receive commands like the one I just described and will roll, reroll and display results

TODO
- Add faces to 3D dice
- Enable to roll dice by drag and drop
- Detect face up after dice becomes stable
- Output result
- Organize 3D after throw
- Integrate commands with 3D
- Refactor 3D code and extract configuration
- Include D4, D8, D10, D12, D20, D100
- Create options page (physics, table size, dice size)
- Create dice logs
- Add option to define variables/characters to create rule automatization
- Roll comparizon
- Roll result callback
- Dice customization (textures, non numeric faces)
- Table customization (table size, table textures, background)
- Sounds
- Special effects
- REST API
- Refactor roll logic code to separate roll, modification, result
- Create jigsaw way to define rolls
- Enable to save rolls and variables
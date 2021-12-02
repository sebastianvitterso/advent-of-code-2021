with open('./input.txt') as file:
    lines = list(map(lambda line: line.strip(), file.readlines()))

commands = list(map(lambda line: line.split(' '), lines))

horizontal = 0
vertical = 0

for [command, step] in commands:
    if(command == 'forward'):
        horizontal += int(step)
    if(command == 'up'):
        vertical -= int(step)
    if(command == 'down'):
        vertical += int(step)

print(horizontal)
print(vertical)
print(horizontal * vertical)

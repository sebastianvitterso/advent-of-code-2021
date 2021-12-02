with open('./input.txt') as file:
    lines = list(map(lambda line: line.strip(), file.readlines()))

commands = list(map(lambda line: line.split(' '), lines))

aim = 0
horizontal = 0
vertical = 0

for [command, step] in commands:
    if(command == 'forward'):
        horizontal += int(step)
        vertical += int(step) * aim
    if(command == 'up'):
        aim -= int(step)
    if(command == 'down'):
        aim += int(step)

print(horizontal)
print(vertical)
print(horizontal * vertical)

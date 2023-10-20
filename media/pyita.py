
import pygame
import numpy as np
import random
from random import shuffle, choice
from time import sleep, perf_counter

# I've tried cython, numba, multiprocessing but any of these seems to work,
# they tend to slow it even more for whatever reason...
from numba import jit
import multiprocessing as mp

pygame.init()
pygame.font.init()
my_font = pygame.font.SysFont('Futura', 30)

# colors
BACKGROUND_DARK = '#2f2a3c'
BACKGROUND = '#352F44'
DARKER = '#5C5470'
DARK = '#B9B4C7'
BRIGHT_DARK = '#e8d9c9'
BRIGHT = '#FAF0E6'
WATER_DARK = '#c1daf0'
WATER_BRIGHT = '#adcdeb'
SMOKE_DARK = '#5d576b'
SMOKE_BRIGHT = '#888198'

scale = 6 # resolution
tick = 60 # fps lock

WIDTH, HEIGHT = (1200, 800)
window = pygame.display.set_mode((WIDTH, HEIGHT))
sim_surface = pygame.Surface((WIDTH//scale, HEIGHT//scale))
sim_surface.fill(BACKGROUND)
pygame.display.set_caption('Pyita')


class Particle():

    __slots__ = ['x', 'y', 'type', 'color', 'age', 'chaos', 'direction']

    def __init__(self, type, x, y, color=BRIGHT):
        self.age = perf_counter()
        self.x, self.y = (x, y)
        self.color = color
        self.type = type # sand, water, smoke, etc.
        self.chaos = 0 # for water only
        self.direction = 0

    def update(self):
        global particles_set
        match self.type:

            case 'sand':
                # Generates 3 places below it's own position + some zeros
                # Offset is basically left/right direction, more zeros = higher chance to go down
                # Shuffle the whole thing to make the movement more nautral
                rand_move = [0, 0, 0, 0, 0, 0, 0, 0, -1, 1]
                np.random.shuffle(rand_move)
                for offset in rand_move:
                    if (self.x + offset, self.y + 1) not in particles_set: # checks if any of these are occupied
                        self.x += offset
                        self.y = self.y+1

            case 'water':
                # bunch of rules for water movement, looks trivial but it does the job
                self.chaos = random.randrange(-1, 2, step=1)

                self.color = choice([WATER_BRIGHT, WATER_DARK])
                if (self.x, self.y+1) not in particles_set:
                    self.y += 1
                    self.direction = random.randrange(-1, 2, step=2)
                else:
                    if (self.x + self.chaos, self.y) not in particles_set:
                        self.x += self.chaos

                if (self.x + self.direction, self.y) in particles_set:
                    # check if there's abstacle, then change direction
                    self.direction *= -1

                self.x += self.direction

            case 'smoke':
                # same logic as water but goes up (y-1)
                self.chaos = random.randrange(-1, 2, step=1)

                self.color = choice([SMOKE_BRIGHT, SMOKE_DARK])
                if (self.x, self.y-1) not in particles_set:
                    self.y -= 1
                    self.direction = random.randrange(-1, 2, step=2)
                else:
                    if (self.x + self.chaos, self.y) not in particles_set:
                        self.x += self.chaos

                if (self.x + self.direction, self.y) in particles_set:
                    # check if there's abstacle, then change direction
                    self.direction *= -1

                self.x += self.direction

    def draw(self):
        pygame.draw.rect(sim_surface, self.color, (self.x, self.y, 1, 1))

def change_brush():
    global brush
    match brush:
        case 'sand'  : brush = 'water'
        case 'water' : brush = 'smoke'
        case 'smoke' : brush = 'sand'


def spawn(x, y):
    global particles_arr
    global particles_set
    x = x//scale
    y = y//scale
    print (x,y)
    if not (x, y) in particles_set:
        match brush:
            case 'sand':
                for size in range(0, brush_size+1, 1):
                    particles_arr.append(Particle('sand', x, y-size, color=choice([BRIGHT,BRIGHT_DARK])))
            case 'water':
                for size in range(0, brush_size+1, 1):
                    particles_arr.append(Particle('water', x, y-size, color=WATER_BRIGHT))
            case 'smoke':
                for size in range(0, brush_size+1, 1):
                    particles_arr.append(Particle('smoke', x, y-size, color=DARK))


# NOT USED
def despawn(x, y):
    global particles_arr
    global particles_set
    if (x, y) in particles_set:
        for i, p in enumerate(particles_arr):
            if (p.x, p.y) == (x, y):
                particles_arr = np.delete(particles_arr, i)


def update_particles():
    global particles_arr
    for p in particles_arr:
        if p.type == 'smoke':
            if perf_counter() - p.age > 10:
                particles_arr.remove(p)
        #if p.type == 'sand':
            #if perf_counter() - p.age < 3:
                # If time of particle gets above 3 seconds it stops calculating which stops it from any movement
                # Python is too slow and this is the key optimization trick, I couldn't any find better solution...
                #p.update()
        #if p.type == 'water':
            #if random.randint(0, 100) < 5:
                ## 5% chance to update so it don't flick on sreen so much
            #p.update()
        p.update()
        p.draw()


def main():
    global brush
    global particles_set
    global particles_arr
    clock = pygame.time.Clock()
    run = True

    while run:
        clock.tick(tick)
        text_fps     = my_font.render(f'FPS: {int(clock.get_fps())}', False, BRIGHT)
        text_counter = my_font.render(f'PIXELS: {len(particles_arr)-4000}', False, BRIGHT)
        text_tool    = my_font.render(f'TOOL: {brush.upper()} (click to change)', False, BRIGHT)


        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False

            if pygame.mouse.get_pressed()[0]:
                # spawns particle on left mouse click
                mouse_x = pygame.mouse.get_pos()[0]
                mouse_y = pygame.mouse.get_pos()[1]
                if (10 <= mouse_x < 70) and (70 <= mouse_y < 90):
                    change_brush()
                x, y = (pygame.mouse.get_pos()[0],
                        pygame.mouse.get_pos()[1])
                spawn(x, y)


            # NOT FIXED YET
            if pygame.mouse.get_pressed()[2]:
                continue
                # remove particle on left mouse click
                x, y = (pygame.mouse.get_pos()[0],
                        pygame.mouse.get_pos()[1])
                despawn(x, y)


        sim_surface.fill(BACKGROUND_DARK)

        # sets are propably best option here because they are fast and immutable

        particles_set = {(p.x, p.y) for p in particles_arr}
        update_particles()


        window.blit(pygame.transform.scale(sim_surface, (WIDTH, HEIGHT)), (0, 0))
        window.blit(sim_surface, (WIDTH-(WIDTH//scale), 0))
        window.blit(text_fps, (10, 10))
        window.blit(text_counter, (10, 40))
        window.blit(text_tool, (10, 70))
        pygame.display.flip()


brush = 'sand'
particles_set = set()
particles_arr = []
water_level = 0
brush_size = 5

for y in range(HEIGHT):
    particles_arr.append(Particle('solid', 0, y, color=DARKER))
    particles_arr.append(Particle('solid', WIDTH//scale-1, y, color=DARKER))
for x in range(WIDTH):
    particles_arr.append(Particle('solid', x, HEIGHT//scale-1, color=DARKER))
    particles_arr.append(Particle('solid', x, 0, color=DARKER))

#spawn(WIDTH // 2, HEIGHT // 2)


if __name__ == "__main__":
    main()


# Regards, Gracjan :]

import type { SoundCategory, Sticker } from '../types';

export const soundCategories: SoundCategory[] = [
  // EASY SOUNDS - Visible lip movements
  {
    sound: 'B',
    label: 'B Sound',
    color: '#FF6B6B',
    difficulty: 'easy',
    words: [
      { id: 'b1', word: 'Ball', sound: 'B', emoji: '🏀', color: '#FF6B6B', emphasisWord: 'B-B-Ball!' },
      { id: 'b2', word: 'Banana', sound: 'B', emoji: '🍌', color: '#FFE135', emphasisWord: 'B-B-Banana!' },
      { id: 'b3', word: 'Bird', sound: 'B', emoji: '🐦', color: '#87CEEB', emphasisWord: 'B-B-Bird!' },
      { id: 'b4', word: 'Butterfly', sound: 'B', emoji: '🦋', color: '#DDA0DD', emphasisWord: 'B-B-Butterfly!' },
      { id: 'b5', word: 'Bear', sound: 'B', emoji: '🧸', color: '#D2691E', emphasisWord: 'B-B-Bear!' },
      { id: 'b6', word: 'Boat', sound: 'B', emoji: '⛵', color: '#4169E1', emphasisWord: 'B-B-Boat!' },
      { id: 'b7', word: 'Bee', sound: 'B', emoji: '🐝', color: '#FFD700', emphasisWord: 'B-B-Bee!' },
      { id: 'b8', word: 'Book', sound: 'B', emoji: '📚', color: '#8B4513', emphasisWord: 'B-B-Book!' },
    ]
  },
  {
    sound: 'M',
    label: 'M Sound',
    color: '#9B59B6',
    difficulty: 'easy',
    words: [
      { id: 'm1', word: 'Moon', sound: 'M', emoji: '🌙', color: '#F5F5DC', emphasisWord: 'M-M-Moon!' },
      { id: 'm2', word: 'Monkey', sound: 'M', emoji: '🐵', color: '#D2691E', emphasisWord: 'M-M-Monkey!' },
      { id: 'm3', word: 'Mouse', sound: 'M', emoji: '🐭', color: '#C0C0C0', emphasisWord: 'M-M-Mouse!' },
      { id: 'm4', word: 'Milk', sound: 'M', emoji: '🥛', color: '#FFFAFA', emphasisWord: 'M-M-Milk!' },
      { id: 'm5', word: 'Muffin', sound: 'M', emoji: '🧁', color: '#DEB887', emphasisWord: 'M-M-Muffin!' },
      { id: 'm6', word: 'Music', sound: 'M', emoji: '🎵', color: '#FF69B4', emphasisWord: 'M-M-Music!' },
      { id: 'm7', word: 'Monster', sound: 'M', emoji: '👾', color: '#9B59B6', emphasisWord: 'M-M-Monster!' },
      { id: 'm8', word: 'Mountain', sound: 'M', emoji: '⛰️', color: '#708090', emphasisWord: 'M-M-Mountain!' },
    ]
  },
  {
    sound: 'P',
    label: 'P Sound',
    color: '#E91E63',
    difficulty: 'easy',
    words: [
      { id: 'p1', word: 'Pig', sound: 'P', emoji: '🐷', color: '#FFB6C1', emphasisWord: 'P-P-Pig!' },
      { id: 'p2', word: 'Pizza', sound: 'P', emoji: '🍕', color: '#FF6347', emphasisWord: 'P-P-Pizza!' },
      { id: 'p3', word: 'Penguin', sound: 'P', emoji: '🐧', color: '#000080', emphasisWord: 'P-P-Penguin!' },
      { id: 'p4', word: 'Panda', sound: 'P', emoji: '🐼', color: '#2F4F4F', emphasisWord: 'P-P-Panda!' },
      { id: 'p5', word: 'Popcorn', sound: 'P', emoji: '🍿', color: '#FFFACD', emphasisWord: 'P-P-Popcorn!' },
      { id: 'p6', word: 'Puzzle', sound: 'P', emoji: '🧩', color: '#32CD32', emphasisWord: 'P-P-Puzzle!' },
      { id: 'p7', word: 'Parrot', sound: 'P', emoji: '🦜', color: '#00FF00', emphasisWord: 'P-P-Parrot!' },
      { id: 'p8', word: 'Pumpkin', sound: 'P', emoji: '🎃', color: '#FF7518', emphasisWord: 'P-P-Pumpkin!' },
    ]
  },
  {
    sound: 'D',
    label: 'D Sound',
    color: '#3498DB',
    difficulty: 'easy',
    words: [
      { id: 'd1', word: 'Dog', sound: 'D', emoji: '🐕', color: '#D2691E', emphasisWord: 'D-D-Dog!' },
      { id: 'd2', word: 'Duck', sound: 'D', emoji: '🦆', color: '#FFD700', emphasisWord: 'D-D-Duck!' },
      { id: 'd3', word: 'Dinosaur', sound: 'D', emoji: '🦕', color: '#228B22', emphasisWord: 'D-D-Dinosaur!' },
      { id: 'd4', word: 'Donut', sound: 'D', emoji: '🍩', color: '#FF69B4', emphasisWord: 'D-D-Donut!' },
      { id: 'd5', word: 'Dolphin', sound: 'D', emoji: '🐬', color: '#00CED1', emphasisWord: 'D-D-Dolphin!' },
      { id: 'd6', word: 'Drum', sound: 'D', emoji: '🥁', color: '#8B0000', emphasisWord: 'D-D-Drum!' },
      { id: 'd7', word: 'Dragon', sound: 'D', emoji: '🐲', color: '#FF4500', emphasisWord: 'D-D-Dragon!' },
      { id: 'd8', word: 'Door', sound: 'D', emoji: '🚪', color: '#8B4513', emphasisWord: 'D-D-Door!' },
    ]
  },
  {
    sound: 'N',
    label: 'N Sound',
    color: '#1ABC9C',
    difficulty: 'easy',
    words: [
      { id: 'n1', word: 'Nose', sound: 'N', emoji: '👃', color: '#FFDAB9', emphasisWord: 'N-N-Nose!' },
      { id: 'n2', word: 'Nest', sound: 'N', emoji: '🪺', color: '#A0522D', emphasisWord: 'N-N-Nest!' },
      { id: 'n3', word: 'Night', sound: 'N', emoji: '🌃', color: '#191970', emphasisWord: 'N-N-Night!' },
      { id: 'n4', word: 'Noodles', sound: 'N', emoji: '🍜', color: '#FFFACD', emphasisWord: 'N-N-Noodles!' },
      { id: 'n5', word: 'Nut', sound: 'N', emoji: '🥜', color: '#DEB887', emphasisWord: 'N-N-Nut!' },
      { id: 'n6', word: 'Nurse', sound: 'N', emoji: '👩‍⚕️', color: '#E6E6FA', emphasisWord: 'N-N-Nurse!' },
      { id: 'n7', word: 'Numbers', sound: 'N', emoji: '🔢', color: '#4169E1', emphasisWord: 'N-N-Numbers!' },
      { id: 'n8', word: 'Notebook', sound: 'N', emoji: '📓', color: '#FFA07A', emphasisWord: 'N-N-Notebook!' },
    ]
  },
  // MEDIUM SOUNDS
  {
    sound: 'T',
    label: 'T Sound',
    color: '#F39C12',
    difficulty: 'medium',
    words: [
      { id: 't1', word: 'Tiger', sound: 'T', emoji: '🐯', color: '#FF8C00', emphasisWord: 'T-T-Tiger!' },
      { id: 't2', word: 'Turtle', sound: 'T', emoji: '🐢', color: '#228B22', emphasisWord: 'T-T-Turtle!' },
      { id: 't3', word: 'Train', sound: 'T', emoji: '🚂', color: '#4682B4', emphasisWord: 'T-T-Train!' },
      { id: 't4', word: 'Tree', sound: 'T', emoji: '🌲', color: '#006400', emphasisWord: 'T-T-Tree!' },
      { id: 't5', word: 'Tomato', sound: 'T', emoji: '🍅', color: '#FF6347', emphasisWord: 'T-T-Tomato!' },
      { id: 't6', word: 'Truck', sound: 'T', emoji: '🚚', color: '#DC143C', emphasisWord: 'T-T-Truck!' },
      { id: 't7', word: 'Tent', sound: 'T', emoji: '⛺', color: '#8B4513', emphasisWord: 'T-T-Tent!' },
      { id: 't8', word: 'Tooth', sound: 'T', emoji: '🦷', color: '#FFFAFA', emphasisWord: 'T-T-Tooth!' },
    ]
  },
  {
    sound: 'C',
    label: 'C Sound',
    color: '#8E44AD',
    difficulty: 'medium',
    words: [
      { id: 'c1', word: 'Cat', sound: 'C', emoji: '🐱', color: '#FF8C00', emphasisWord: 'C-C-Cat!' },
      { id: 'c2', word: 'Cake', sound: 'C', emoji: '🎂', color: '#FFB6C1', emphasisWord: 'C-C-Cake!' },
      { id: 'c3', word: 'Carrot', sound: 'C', emoji: '🥕', color: '#FF7F50', emphasisWord: 'C-C-Carrot!' },
      { id: 'c4', word: 'Cow', sound: 'C', emoji: '🐄', color: '#2F4F4F', emphasisWord: 'C-C-Cow!' },
      { id: 'c5', word: 'Cup', sound: 'C', emoji: '☕', color: '#D2691E', emphasisWord: 'C-C-Cup!' },
      { id: 'c6', word: 'Cookie', sound: 'C', emoji: '🍪', color: '#DEB887', emphasisWord: 'C-C-Cookie!' },
      { id: 'c7', word: 'Car', sound: 'C', emoji: '🚗', color: '#DC143C', emphasisWord: 'C-C-Car!' },
      { id: 'c8', word: 'Corn', sound: 'C', emoji: '🌽', color: '#FFD700', emphasisWord: 'C-C-Corn!' },
    ]
  },
  {
    sound: 'K',
    label: 'K Sound',
    color: '#9B59B6',
    difficulty: 'medium',
    words: [
      { id: 'k1', word: 'Kangaroo', sound: 'K', emoji: '🦘', color: '#D2691E', emphasisWord: 'K-K-Kangaroo!' },
      { id: 'k2', word: 'Key', sound: 'K', emoji: '🔑', color: '#FFD700', emphasisWord: 'K-K-Key!' },
      { id: 'k3', word: 'Kite', sound: 'K', emoji: '🪁', color: '#FF69B4', emphasisWord: 'K-K-Kite!' },
      { id: 'k4', word: 'King', sound: 'K', emoji: '🤴', color: '#9400D3', emphasisWord: 'K-K-King!' },
      { id: 'k5', word: 'Koala', sound: 'K', emoji: '🐨', color: '#808080', emphasisWord: 'K-K-Koala!' },
      { id: 'k6', word: 'Kitten', sound: 'K', emoji: '🐈', color: '#FFB6C1', emphasisWord: 'K-K-Kitten!' },
      { id: 'k7', word: 'Kitchen', sound: 'K', emoji: '🍳', color: '#F5F5DC', emphasisWord: 'K-K-Kitchen!' },
      { id: 'k8', word: 'Kick', sound: 'K', emoji: '⚽', color: '#228B22', emphasisWord: 'K-K-Kick!' },
    ]
  },
  {
    sound: 'G',
    label: 'G Sound',
    color: '#27AE60',
    difficulty: 'medium',
    words: [
      { id: 'g1', word: 'Goat', sound: 'G', emoji: '🐐', color: '#F5F5DC', emphasisWord: 'G-G-Goat!' },
      { id: 'g2', word: 'Gorilla', sound: 'G', emoji: '🦍', color: '#2F4F4F', emphasisWord: 'G-G-Gorilla!' },
      { id: 'g3', word: 'Grapes', sound: 'G', emoji: '🍇', color: '#9400D3', emphasisWord: 'G-G-Grapes!' },
      { id: 'g4', word: 'Guitar', sound: 'G', emoji: '🎸', color: '#8B4513', emphasisWord: 'G-G-Guitar!' },
      { id: 'g5', word: 'Gift', sound: 'G', emoji: '🎁', color: '#FF0000', emphasisWord: 'G-G-Gift!' },
      { id: 'g6', word: 'Glasses', sound: 'G', emoji: '👓', color: '#000080', emphasisWord: 'G-G-Glasses!' },
      { id: 'g7', word: 'Garden', sound: 'G', emoji: '🌻', color: '#228B22', emphasisWord: 'G-G-Garden!' },
      { id: 'g8', word: 'Ghost', sound: 'G', emoji: '👻', color: '#F8F8FF', emphasisWord: 'G-G-Ghost!' },
    ]
  },
  {
    sound: 'F',
    label: 'F Sound',
    color: '#E74C3C',
    difficulty: 'medium',
    words: [
      { id: 'f1', word: 'Fish', sound: 'F', emoji: '🐟', color: '#4169E1', emphasisWord: 'F-F-Fish!' },
      { id: 'f2', word: 'Frog', sound: 'F', emoji: '🐸', color: '#32CD32', emphasisWord: 'F-F-Frog!' },
      { id: 'f3', word: 'Flower', sound: 'F', emoji: '🌸', color: '#FF69B4', emphasisWord: 'F-F-Flower!' },
      { id: 'f4', word: 'Fox', sound: 'F', emoji: '🦊', color: '#FF4500', emphasisWord: 'F-F-Fox!' },
      { id: 'f5', word: 'Fire', sound: 'F', emoji: '🔥', color: '#FF4500', emphasisWord: 'F-F-Fire!' },
      { id: 'f6', word: 'Feet', sound: 'F', emoji: '🦶', color: '#FFDAB9', emphasisWord: 'F-F-Feet!' },
      { id: 'f7', word: 'Fan', sound: 'F', emoji: '🪭', color: '#87CEEB', emphasisWord: 'F-F-Fan!' },
      { id: 'f8', word: 'Fork', sound: 'F', emoji: '🍴', color: '#C0C0C0', emphasisWord: 'F-F-Fork!' },
    ]
  },
  // HARDER SOUNDS
  {
    sound: 'S',
    label: 'S Sound',
    color: '#00BCD4',
    difficulty: 'hard',
    words: [
      { id: 's1', word: 'Sun', sound: 'S', emoji: '☀️', color: '#FFD700', emphasisWord: 'S-S-Sun!' },
      { id: 's2', word: 'Star', sound: 'S', emoji: '⭐', color: '#FFD700', emphasisWord: 'S-S-Star!' },
      { id: 's3', word: 'Snake', sound: 'S', emoji: '🐍', color: '#228B22', emphasisWord: 'S-S-Snake!' },
      { id: 's4', word: 'Sandwich', sound: 'S', emoji: '🥪', color: '#DEB887', emphasisWord: 'S-S-Sandwich!' },
      { id: 's5', word: 'Sock', sound: 'S', emoji: '🧦', color: '#FF69B4', emphasisWord: 'S-S-Sock!' },
      { id: 's6', word: 'Smile', sound: 'S', emoji: '😊', color: '#FFD700', emphasisWord: 'S-S-Smile!' },
      { id: 's7', word: 'Spider', sound: 'S', emoji: '🕷️', color: '#000000', emphasisWord: 'S-S-Spider!' },
      { id: 's8', word: 'Seal', sound: 'S', emoji: '🦭', color: '#708090', emphasisWord: 'S-S-Seal!' },
    ]
  },
  {
    sound: 'L',
    label: 'L Sound',
    color: '#FF9800',
    difficulty: 'hard',
    words: [
      { id: 'l1', word: 'Lion', sound: 'L', emoji: '🦁', color: '#FFD700', emphasisWord: 'L-L-Lion!' },
      { id: 'l2', word: 'Lemon', sound: 'L', emoji: '🍋', color: '#FFFF00', emphasisWord: 'L-L-Lemon!' },
      { id: 'l3', word: 'Leaf', sound: 'L', emoji: '🍃', color: '#228B22', emphasisWord: 'L-L-Leaf!' },
      { id: 'l4', word: 'Ladybug', sound: 'L', emoji: '🐞', color: '#FF0000', emphasisWord: 'L-L-Ladybug!' },
      { id: 'l5', word: 'Lamp', sound: 'L', emoji: '🪔', color: '#FFD700', emphasisWord: 'L-L-Lamp!' },
      { id: 'l6', word: 'Llama', sound: 'L', emoji: '🦙', color: '#F5F5DC', emphasisWord: 'L-L-Llama!' },
      { id: 'l7', word: 'Lips', sound: 'L', emoji: '👄', color: '#FF69B4', emphasisWord: 'L-L-Lips!' },
      { id: 'l8', word: 'Lock', sound: 'L', emoji: '🔒', color: '#C0C0C0', emphasisWord: 'L-L-Lock!' },
    ]
  },
  {
    sound: 'R',
    label: 'R Sound',
    color: '#9C27B0',
    difficulty: 'hard',
    words: [
      { id: 'r1', word: 'Rabbit', sound: 'R', emoji: '🐰', color: '#FFB6C1', emphasisWord: 'R-R-Rabbit!' },
      { id: 'r2', word: 'Rainbow', sound: 'R', emoji: '🌈', color: '#FF69B4', emphasisWord: 'R-R-Rainbow!' },
      { id: 'r3', word: 'Robot', sound: 'R', emoji: '🤖', color: '#C0C0C0', emphasisWord: 'R-R-Robot!' },
      { id: 'r4', word: 'Rocket', sound: 'R', emoji: '🚀', color: '#FF4500', emphasisWord: 'R-R-Rocket!' },
      { id: 'r5', word: 'Rose', sound: 'R', emoji: '🌹', color: '#FF0000', emphasisWord: 'R-R-Rose!' },
      { id: 'r6', word: 'Ring', sound: 'R', emoji: '💍', color: '#FFD700', emphasisWord: 'R-R-Ring!' },
      { id: 'r7', word: 'Rain', sound: 'R', emoji: '🌧️', color: '#4169E1', emphasisWord: 'R-R-Rain!' },
      { id: 'r8', word: 'Rooster', sound: 'R', emoji: '🐓', color: '#FF4500', emphasisWord: 'R-R-Rooster!' },
    ]
  },
];

export const allStickers: Sticker[] = [
  { id: 'st1', emoji: '⭐', name: 'Gold Star', unlocked: false },
  { id: 'st2', emoji: '🌟', name: 'Sparkle Star', unlocked: false },
  { id: 'st3', emoji: '🏆', name: 'Trophy', unlocked: false },
  { id: 'st4', emoji: '🎉', name: 'Party', unlocked: false },
  { id: 'st5', emoji: '🦄', name: 'Unicorn', unlocked: false },
  { id: 'st6', emoji: '🐱', name: 'Kitty', unlocked: false },
  { id: 'st7', emoji: '🐶', name: 'Puppy', unlocked: false },
  { id: 'st8', emoji: '🦋', name: 'Butterfly', unlocked: false },
  { id: 'st9', emoji: '🌈', name: 'Rainbow', unlocked: false },
  { id: 'st10', emoji: '🍭', name: 'Lollipop', unlocked: false },
  { id: 'st11', emoji: '🎈', name: 'Balloon', unlocked: false },
  { id: 'st12', emoji: '🍦', name: 'Ice Cream', unlocked: false },
  { id: 'st13', emoji: '🧸', name: 'Teddy', unlocked: false },
  { id: 'st14', emoji: '🎀', name: 'Bow', unlocked: false },
  { id: 'st15', emoji: '💎', name: 'Diamond', unlocked: false },
  { id: 'st16', emoji: '🌺', name: 'Flower', unlocked: false },
  { id: 'st17', emoji: '🦁', name: 'Lion', unlocked: false },
  { id: 'st18', emoji: '🐼', name: 'Panda', unlocked: false },
  { id: 'st19', emoji: '🦊', name: 'Fox', unlocked: false },
  { id: 'st20', emoji: '🐸', name: 'Froggy', unlocked: false },
  { id: 'st21', emoji: '🎪', name: 'Circus', unlocked: false },
  { id: 'st22', emoji: '🎠', name: 'Carousel', unlocked: false },
  { id: 'st23', emoji: '🎡', name: 'Ferris Wheel', unlocked: false },
  { id: 'st24', emoji: '🏰', name: 'Castle', unlocked: false },
];

export const celebrationMessages = [
  "Amazing!",
  "Wonderful!",
  "Super!",
  "Great job!",
  "You did it!",
  "Fantastic!",
  "Hooray!",
  "Yay!",
  "Awesome!",
  "Beautiful!",
];

export const encouragementMessages = [
  "You can do it!",
  "Try again!",
  "Keep going!",
  "Almost there!",
  "So close!",
];

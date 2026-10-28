export const FORMATIONS = {
  '4-3-3': [
    ['GOL', 1, -49, 0, 'GK'],
    ['LD', 2, -36, -24, 'DEF'],
    ['ZAG', 3, -36.5, -8, 'DEF'],
    ['ZAG', 4, -36.5, 8, 'DEF'],
    ['LE', 6, -36, 24, 'DEF'],
    ['VOL', 5, -22, -14, 'MID'],
    ['MEI', 8, -23, 0, 'MID'],
    ['MEI', 10, -22, 14, 'MID'],
    ['PD', 7, -8, -18, 'FWD'],
    ['ATA', 9, -5, 0, 'FWD'],
    ['PE', 11, -8, 18, 'FWD']
  ],
  '4-4-2': [
    ['GOL', 1, -49, 0, 'GK'],
    ['LD', 2, -36, -24, 'DEF'],
    ['ZAG', 3, -36.5, -8, 'DEF'],
    ['ZAG', 4, -36.5, 8, 'DEF'],
    ['LE', 6, -36, 24, 'DEF'],
    ['MD', 7, -19, -24, 'MID'],
    ['VOL', 5, -21, -8, 'MID'],
    ['MEI', 8, -21, 8, 'MID'],
    ['ME', 11, -19, 24, 'MID'],
    ['ATA', 9, -6, -9, 'FWD'],
    ['ATA', 10, -6, 9, 'FWD']
  ],
  '4-2-3-1': [
    ['GOL', 1, -49, 0, 'GK'],
    ['LD', 2, -36, -24, 'DEF'],
    ['ZAG', 3, -36.5, -8, 'DEF'],
    ['ZAG', 4, -36.5, 8, 'DEF'],
    ['LE', 6, -36, 24, 'DEF'],
    ['VOL', 5, -24, -8, 'MID'],
    ['VOL', 8, -24, 8, 'MID'],
    ['MD', 7, -14, -19, 'MID'],
    ['MEI', 10, -15, 0, 'MID'],
    ['ME', 11, -14, 19, 'MID'],
    ['ATA', 9, -5, 0, 'FWD']
  ],
  '4-1-4-1': [
    ['GOL', 1, -49, 0, 'GK'],
    ['LD', 2, -36, -24, 'DEF'],
    ['ZAG', 3, -36.5, -8, 'DEF'],
    ['ZAG', 4, -36.5, 8, 'DEF'],
    ['LE', 6, -36, 24, 'DEF'],
    ['VOL', 5, -27, 0, 'MID'],
    ['MD', 7, -15, -21, 'MID'],
    ['MEI', 8, -17, -5, 'MID'],
    ['MEI', 10, -17, 9, 'MID'],
    ['ME', 11, -15, 21, 'MID'],
    ['ATA', 9, -5, 0, 'FWD']
  ],
  '3-4-3': [
    ['GOL', 1, -49, 0, 'GK'],
    ['ZAG', 3, -37, -14, 'DEF'],
    ['ZAG', 4, -37, 0, 'DEF'],
    ['ZAG', 5, -37, 14, 'DEF'],
    ['MD', 7, -20, -25, 'MID'],
    ['MEI', 8, -22, -6, 'MID'],
    ['MEI', 10, -22, 8, 'MID'],
    ['ME', 11, -20, 25, 'MID'],
    ['PD', 9, -8, -18, 'FWD'],
    ['ATA', 19, -6, 0, 'FWD'],
    ['PE', 17, -8, 18, 'FWD']
  ],
  '3-5-2': [
    ['GOL', 1, -49, 0, 'GK'],
    ['ZAG', 3, -37, -14, 'DEF'],
    ['ZAG', 4, -37, 0, 'DEF'],
    ['ZAG', 5, -37, 14, 'DEF'],
    ['LD', 2, -20, -26, 'MID'],
    ['MEI', 8, -22, -10, 'MID'],
    ['VOL', 6, -26, 0, 'MID'],
    ['MEI', 10, -22, 10, 'MID'],
    ['LE', 11, -20, 26, 'MID'],
    ['ATA', 9, -7, -8, 'FWD'],
    ['ATA', 19, -7, 8, 'FWD']
  ]
}

const NAME_POOLS = {
  brazil: {
    first: ['Vini', 'Rodry', 'Endri', 'Raph', 'Gabry', 'Bruninho', 'Marquim', 'Richarli', 'Antoni', 'Lucas', 'Matheus', 'Joao', 'Pedro', 'Estevao', 'Savinho', 'Igor', 'Danilo', 'Weverton', 'Ederson', 'Murilo', 'Kaio', 'Yan', 'Luiz', 'Neto', 'Talles', 'Rodrigo', 'Felipe', 'Caio', 'Douglas', 'Alison'],
    last: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Lima', 'Rocha', 'Alves', 'Nunes', 'Mendes', 'Ferreira', 'Pereira', 'Ribeiro', 'Cardoso', 'Moreira', 'Barbosa', 'Araujo', 'Nascimento', 'Santana', 'Batista', 'Moura', 'Teixeira', 'Freitas', 'Martins', 'Gomes', 'Correia', 'Pinto', 'Lopes', 'Goes', 'Martinele']
  },
  england: {
    first: ['Jude', 'Harry', 'Phil', 'Bukayo', 'Declan', 'Cole', 'Reece', 'Mason', 'Jack', 'Jordan', 'Marcus', 'Ollie', 'Levi', 'Kobbie', 'Anthony', 'Ben', 'Conor', 'Jadon', 'Morgan', 'Eberechi', 'Liam', 'Callum', 'Tyler', 'Archie', 'Owen', 'Harvey', 'James', 'Aaron'],
    last: ['Bellam', 'Kain', 'Fodden', 'Sako', 'Rise', 'Palmer', 'Walker', 'Stones', 'Grelish', 'Hendon', 'Rashfor', 'Watkis', 'Madison', 'Gordon', 'Bowen', 'Ezi', 'Colwil', 'Guehy', 'Wharto', 'Maddox', 'Bennet', 'Clarke', 'Foster', 'Hughes', 'Mitchel', 'Reid', 'Trent', 'Ward']
  },
  spain: {
    first: ['Lamin', 'Pedri', 'Gavi', 'Vini', 'Rodri', 'Dani', 'Alvaro', 'Iker', 'Sergio', 'Xabi', 'Mikel', 'Pau', 'Nico', 'Fermin', 'Alex', 'Marc', 'Hugo', 'Unai', 'Ander', 'Bryan', 'Aitor', 'Iago', 'Javier', 'Mateo', 'Raul', 'Oihan', 'Braim', 'Adrian'],
    last: ['Yamal', 'Gonz', 'Gavira', 'Sol', 'Rodri', 'Carvajo', 'Hermoso', 'Torres', 'Iniesto', 'Busquet', 'Ramos', 'Alba', 'Morato', 'Asencio', 'Olmo', 'Cubarsa', 'Baldo', 'Merino', 'Zubimendo', 'Sancet', 'Vivian', 'Grimaldo', 'Pedraza', 'Fornals', 'Oyarzabal', 'Bryan', 'Gil', 'Vega']
  },
  italy: {
    first: ['Gianluca', 'Nicolo', 'Sandro', 'Lorenzo', 'Federico', 'Mateo', 'Davide', 'Alessandro', 'Riccardo', 'Giacomo', 'Andrea', 'Marco', 'Ciro', 'Domenico', 'Giovanni', 'Mattia', 'Samuele', 'Michele', 'Antonio', 'Bryan', 'Luca', 'Fabio', 'Simone', 'Pietro'],
    last: ['Donarumo', 'Barello', 'Bastone', 'Chieso', 'Tonalo', 'Locatelo', 'Raspadoro', 'Scamaco', 'Fratteso', 'Dimarco', 'Calafiore', 'Mancini', 'Cristanto', 'Pellegrini', 'Immobilo', 'Insigno', 'Verrato', 'Jorgino', 'Zacagni', 'Retegui', 'Barella', 'Gatti', 'Buongiorno', 'Orsolini', 'Politano', 'Rovella', 'Udogie', 'Zaccagni']
  },
  germany: {
    first: ['Jamil', 'Kai', 'Florian', 'Joshua', 'Manuel', 'Leroy', 'Serge', 'Thomas', 'Toni', 'Nico', 'Benjamin', 'Robin', 'Marc', 'Aleksandar', 'Deniz', 'Karim', 'Maximilian', 'Jonas', 'Felix', 'Leon', 'David', 'Jamal', 'Lukas', 'Omar'],
    last: ['Musala', 'Havritz', 'Wirz', 'Kimmish', 'Noyer', 'Gnabri', 'Sano', 'Muller', 'Kroz', 'Rudigar', 'Schlotter', 'Sane', 'Gundogo', 'Raun', 'Tah', 'Andrish', 'Fullkrug', 'Adeyemo', 'Beier', 'Pavlovic', 'Stiller', 'Kleindienst', 'Baumann', 'Anton']
  },
  france: {
    first: ['Kylio', 'Ousman', 'Antonin', 'Aurelien', 'Theo', 'Mike', 'Jules', 'Dayot', 'Ibrahima', 'Randal', 'Marcus', 'Bradley', 'Eduardo', 'Warren', 'Michael', 'Christopher', 'Matteo', 'Hugo', 'Rayan', 'Desire', 'Enzo', 'Manu', 'Lucas', 'Youssouf'],
    last: ['Mbapo', 'Dembelo', 'Griezo', 'Tchouamen', 'Camavanga', 'Salibo', 'Upamecano', 'Kounda', 'Hernando', 'Thuram', 'Barcola', 'Coman', 'Nkunkou', 'Rabio', 'Girou', 'Pavar', 'Magnan', 'Konato', 'Claus', 'Fofano', 'Doue', 'Muani', 'Kolo', 'Singo']
  },
  portugal: {
    first: ['Cristian', 'Ronaldo', 'Bruno', 'Bernardo', 'Rafael', 'Joao', 'Diogo', 'Vitinha', 'Ruben', 'Nuno', 'Goncalo', 'Pedro', 'Francisco', 'Antonio', 'Otavio', 'Matheus', 'Andre', 'Nelson', 'Ricardo', 'Tiago', 'Fabio', 'Joao', 'Goncalo', 'Pedro'],
    last: ['Ronaldo', 'Fernandos', 'Silva', 'Santos', 'Leano', 'Cancel', 'Diaz', 'Neves', 'Ramos', 'Feliz', 'Conceic', 'Horta', 'Trincao', 'Mendes', 'Guerreiro', 'Palhina', 'Vitinho', 'Nunes', 'Carvalo', 'Sousa', 'Moutinho', 'Quaresma', 'Dalot', 'Inacio']
  },
  netherlands: {
    first: ['Virgil', 'Frenkie', 'Cody', 'Memphis', 'Xavi', 'Denzel', 'Matthijs', 'Stefan', 'Wout', 'Donyell', 'Tijjani', 'Jeremie', 'Lutsharel', 'Micky', 'Nathan', 'Brian', 'Ryan', 'Daley', 'Steven', 'Quincy', 'Joey', 'Mats', 'Kenneth', 'Noa'],
    last: ['van Dyk', 'de Jonge', 'Gakpon', 'Depai', 'Simons', 'Dumfris', 'de Licht', 'van de Vem', 'Kooman', 'Bergwain', 'Veermans', 'Timber', 'Ake', 'Blind', 'de Roon', 'Wijnoldo', 'Malan', 'Brobby', 'Frimpongo', 'Hartman', 'Weghorst', 'Lang', 'Geertruida', 'Verbruggen']
  },
  argentina: {
    first: ['Leo', 'Julian', 'Lautaro', 'Enzo', 'Alexis', 'Mac', 'Nico', 'Paulo', 'Angel', 'Emiliano', 'Rodrigo', 'Valentin', 'Facundo', 'Thiago', 'Franco', 'Exequiel', 'Giovani', 'Alejandro', 'Nicolas', 'Matias', 'Santiago', 'Cristian', 'Marcos', 'Lucas'],
    last: ['Messa', 'Alvarez', 'Martines', 'Fernandez', 'MacAlister', 'Di Mario', 'Paredo', 'Otamendy', 'Romero', 'Molino', 'Correo', 'Montiel', 'Palacio', 'De Paulo', 'Almado', 'Buendio', 'Tagliafio', 'Acuna', 'Rulli', 'Pezzella', 'Medina', 'Carboni', 'Simeone', 'Quarta']
  },
  mexico: {
    first: ['Santiago', 'Hirving', 'Raul', 'Edson', 'Luis', 'Alexis', 'Guillermo', 'Cesar', 'Jesus', 'Henry', 'Orbelin', 'Erick', 'Jorge', 'Johan', 'Uriel', 'Roberto', 'Marcel', 'Carlos', 'Diego', 'Fernando', 'Israel', 'Javier', 'Emilio', 'Rodrigo'],
    last: ['Jimeno', 'Lozano', 'Alvarado', 'Montes', 'Vega', 'Martin', 'Hernandez', 'Corona', 'Rodriguez', 'Antuna', 'Gallardo', 'Romo', 'Sanchez', 'Araujo', 'Ochoa', 'Alvarez', 'Gutierrez', 'Pineda', 'Sepulveda', 'Huerta', 'Reyes', 'Lainez', 'Cordova', 'Chavez']
  },
  usa: {
    first: ['Christian', 'Weston', 'Tyler', 'Gio', 'Sergino', 'Antonee', 'Brenden', 'Yunus', 'Folarin', 'Ricardo', 'Matt', 'Walker', 'Chris', 'Jordan', 'Brandon', 'Luca', 'Malik', 'Johnny', 'Tanner', 'Paxten', 'Josh', 'Caden', 'Diego', 'Jackson'],
    last: ['Pulisik', 'McKinney', 'Adamo', 'Reina', 'Desto', 'Robinson', 'Aronson', 'Musa', 'Balogon', 'Pepy', 'Turner', 'Richards', 'Carter', 'Vickers', 'Morris', 'Luna', 'Tilman', 'Cowel', 'Schult', 'Sargent', 'Reyna', 'Weah', 'Aaronson', 'Scally']
  },
  arabia: {
    first: ['Salem', 'Mohammed', 'Ali', 'Firas', 'Saud', 'Abdullah', 'Nawaf', 'Hassan', 'Abdulrahman', 'Sultan', 'Fahad', 'Khalid', 'Nasser', 'Yasser', 'Majed', 'Talal', 'Saleh', 'Omar', 'Ziyad', 'Ayman', 'Hattan', 'Faisal', 'Turki', 'Sami'],
    last: ['Al-Dosari', 'Al-Shehri', 'Al-Buraikan', 'Al-Otaibi', 'Al-Ghannam', 'Al-Harbi', 'Al-Najei', 'Al-Malki', 'Al-Amri', 'Al-Sqoor', 'Al-Yami', 'Al-Qahtani', 'Al-Faraj', 'Al-Bishi', 'Al-Sulayhem', 'Al-Dawsari', 'Al-Hassan', 'Al-Saleh', 'Al-Zahrani', 'Al-Rashidi', 'Al-Khaibari', 'Al-Tambakti', 'Al-Bulaihi', 'Al-Owais']
  },
  turkey: {
    first: ['Hakan', 'Arda', 'Kenan', 'Cengiz', 'Caglar', 'Merih', 'Ferdi', 'Orkun', 'Salih', 'Kerem', 'Yusuf', 'Baris', 'Mert', 'Altay', 'Zeki', 'Irfan', 'Emre', 'Ozan', 'Berke', 'Oguz', 'Semih', 'Furkan', 'Halil', 'Cenk'],
    last: ['Calhan', 'Gulo', 'Yildir', 'Tosun', 'Soyun', 'Demira', 'Akay', 'Kokcu', 'Yazico', 'Akturk', 'Kadioglo', 'Ozcan', 'Kahveci', 'Bay', 'Tepe', 'Kaya', 'Demir', 'Celik', 'Erdem', 'Yilmaz', 'Sahin', 'Kilic', 'Aslan', 'Ozturk']
  },
  africa: {
    first: ['Mohamed', 'Achraf', 'Hakim', 'Sadio', 'Riyad', 'Victor', 'Ademola', 'Serhou', 'Youssef', 'Ismail', 'Franck', 'Wilfried', 'Sebastien', 'Kalidou', 'Edouard', 'Andre', 'Thomas', 'Amine', 'Anass', 'Brahim', 'Ibrahima', 'Cheikh', 'Moussa', 'Yassine'],
    last: ['Saleh', 'Hakim', 'Ziyek', 'Mano', 'Mahre', 'Osimen', 'Lukman', 'Girassy', 'Bouno', 'Kessy', 'Ndidi', 'Koulibalo', 'Mendy', 'Diatta', 'Gouiri', 'Amrabo', 'Ounaho', 'En-Nesri', 'Diouf', 'Sarr', 'Keita', 'Traore', 'Bamba', 'Zaha']
  },
  asia: {
    first: ['San', 'Heung-Min', 'Kaoru', 'Takefusa', 'Wataru', 'Ritsu', 'Daichi', 'Min-Jae', 'Hee-Chan', 'Kang-In', 'Woo-Young', 'Takumi', 'Hidemasa', 'Ao', 'Ayase', 'Koki', 'Hyun-Woo', 'Ji-Sung', 'Daizen', 'Reo', 'Jae-Sung', 'In-Beom', 'Seung-Ho', 'Gue-Sung'],
    last: ['Min', 'Kim', 'Lee', 'Park', 'Hwang', 'Endo', 'Mitoma', 'Kubo', 'Doan', 'Kamada', 'Tomiyasu', 'Itakura', 'Yamamoto', 'Suzuki', 'Sato', 'Sonn', 'Rhee', 'Jang', 'Cho', 'Hong', 'Tanaka', 'Nakamura', 'Watanabe', 'Ito']
  },
  oceania: {
    first: ['Craig', 'Mat', 'Jackson', 'Harry', 'Riley', 'Marco', 'Cameron', 'Jamie', 'Awer', 'Garang', 'Kusini', 'Nestory', 'Mitch', 'Ryan', 'Chris', 'Lewis', 'Martin', 'Jay', 'Daniel', 'Lachlan', 'Connor', 'Bailey', 'Alex', 'Noah'],
    last: ['Goodwin', 'Ryan', 'Irvine', 'Souttar', 'Bos', 'Mooy', 'Rojas', 'Maclaren', 'Mabil', 'Kuol', 'Yengi', 'Irankunda', 'Duke', 'Behich', 'Atkinson', 'Boyle', 'Lecky', 'Wright', 'Strain', 'Tilio', 'Cirkic', 'Velupillay', 'Metcalfe', 'Miller']
  }
}

const club = (id, name, short, city, country, league, primary, secondary, accent, crestA, crestB, rating, formation, keeper, shorts, region) => ({
  id,
  name,
  short,
  letter: short[0],
  city,
  country,
  league,
  primary,
  secondary,
  accent,
  crestA,
  crestB,
  rating,
  formation,
  keeper,
  shorts,
  region
})

export const TEAMS = [
  club('aurora', 'Aurora FC', 'AUR', 'Neo Horizonte', 'Brasil', 'Liga Prisma', '#55e6ff', '#08263d', '#8ff2ff', '#0d4a68', '#061624', 84, '4-3-3', '#d9fbff', '#0a1b2b', 'brazil'),
  club('rubro', 'Rubro United', 'RUB', 'Porto Rubro', 'Brasil', 'Liga Prisma', '#ff4d5e', '#2b0710', '#ff8f9a', '#7a1524', '#21040a', 82, '4-4-2', '#ffe6a3', '#2a0910', 'brazil'),
  club('verde', 'Verde Valley', 'VER', 'Vale Verde', 'Brasil', 'Liga Prisma', '#46f0b4', '#05261d', '#9bffdc', '#10654c', '#041d16', 80, '4-2-3-1', '#f6ffca', '#08231b', 'brazil'),
  club('prisma', 'Real Prisma', 'RPR', 'Prisma Central', 'Brasil', 'Liga Prisma', '#c084fc', '#1a0a2e', '#e0c4ff', '#55227a', '#180828', 81, '4-3-3', '#f0ddff', '#1b0b2c', 'brazil'),

  club('north-london', 'North London FC', 'NLD', 'Londres', 'Inglaterra', 'Premier League', '#ef3340', '#f4f4f4', '#ffd166', '#a3132c', '#250509', 87, '4-3-3', '#f4f4f4', '#ef3340', 'england'),
  club('manchester-sky', 'Manchester Sky', 'MCS', 'Manchester', 'Inglaterra', 'Premier League', '#6caddf', '#1c2c4c', '#bfe8ff', '#2f7db5', '#0a2038', 88, '4-3-3', '#d8f2ff', '#1c2c4c', 'england'),
  club('merseyside-red', 'Merseyside Red', 'MRE', 'Liverpool', 'Inglaterra', 'Premier League', '#d81e2c', '#171717', '#ff8f96', '#8f111b', '#1b0507', 87, '4-3-3', '#ffe6a3', '#171717', 'england'),
  club('manchester-red', 'Manchester Red', 'MNR', 'Manchester', 'Inglaterra', 'Premier League', '#d71920', '#f4f4f4', '#ffb3b8', '#8b0d12', '#200306', 84, '4-2-3-1', '#f4f4f4', '#d71920', 'england'),
  club('london-blue', 'London Blue', 'LNB', 'Londres', 'Inglaterra', 'Premier League', '#1f4ba5', '#f4f4f4', '#8bb8ff', '#12306d', '#061126', 85, '4-2-3-1', '#f4f4f4', '#1f4ba5', 'england'),
  club('north-tottenham', 'North Tottenham', 'NTT', 'Londres', 'Inglaterra', 'Premier League', '#f4f4f4', '#0b1b3a', '#d8e8ff', '#d9d9d9', '#0b1b3a', 83, '4-2-3-1', '#f4d35e', '#0b1b3a', 'england'),
  club('tyne-magpies', 'Tyne Magpies', 'TYN', 'Newcastle', 'Inglaterra', 'Premier League', '#1a1a1a', '#f4f4f4', '#b8c6d8', '#242424', '#090909', 82, '4-3-3', '#f4f4f4', '#1a1a1a', 'england'),
  club('birmingham-villa', 'Birmingham Villans', 'BVL', 'Birmingham', 'Inglaterra', 'Premier League', '#7a1f3d', '#95bfe5', '#e4bce9', '#4a0e22', '#160410', 81, '4-4-2', '#f2f2f2', '#95bfe5', 'england'),

  club('madrid-white', 'Madrid Blanco', 'MDW', 'Madri', 'Espanha', 'La Liga', '#f3f5f8', '#d4af37', '#ffe9a3', '#d9dde3', '#555f74', 88, '4-3-3', '#b8f0d0', '#d4af37', 'spain'),
  club('catalonia-bla', 'Catalonia Blaugrana', 'CAT', 'Barcelona', 'Espanha', 'La Liga', '#004d98', '#a50044', '#ff7b9c', '#00346a', '#640029', 87, '4-3-3', '#d8ffb4', '#004d98', 'spain'),
  club('madrid-rojo', 'Madrid Rojiblanco', 'MDR', 'Madri', 'Espanha', 'La Liga', '#d71920', '#f4f4f4', '#ff9c9c', '#8f0f14', '#200305', 85, '4-4-2', '#f4f4f4', '#d71920', 'spain'),
  club('sevilla-nerv', 'Sevilla Nervión', 'SEV', 'Sevilha', 'Espanha', 'La Liga', '#d71920', '#f4f4f4', '#ffb35c', '#8f0f14', '#230406', 81, '4-2-3-1', '#f4f4f4', '#d71920', 'spain'),
  club('valencia-ches', 'Valencia Ches', 'VAL', 'Valência', 'Espanha', 'La Liga', '#f5a623', '#111111', '#ffe08a', '#b36c07', '#241704', 79, '4-4-2', '#f4f4f4', '#111111', 'spain'),
  club('bilbao-lions', 'Bilbao Lions', 'BIL', 'Bilbao', 'Espanha', 'La Liga', '#d71920', '#f4f4f4', '#ff9c9c', '#8f0f14', '#220305', 80, '4-4-2', '#f4f4f4', '#d71920', 'spain'),
  club('donostia-blue', 'Donostia Txuri', 'DON', 'San Sebastián', 'Espanha', 'La Liga', '#1d5ba4', '#f4f4f4', '#7fc3e8', '#123a6d', '#061428', 81, '4-3-3', '#f4f4f4', '#1d5ba4', 'spain'),
  club('villarreal-sub', 'Villarreal Submarino', 'VIL', 'Villarreal', 'Espanha', 'La Liga', '#f5d000', '#1b2a5a', '#fff28a', '#b89b00', '#101a3a', 80, '4-4-2', '#f4f4f4', '#1b2a5a', 'spain'),

  club('milano-nera', 'Milano Nerazzurri', 'MLN', 'Milão', 'Italia', 'Serie A', '#0b1f4d', '#111111', '#6c8cff', '#081532', '#05070c', 86, '3-5-2', '#f4f4f4', '#111111', 'italy'),
  club('milano-rossa', 'Milano Rossoneri', 'MLR', 'Milão', 'Italia', 'Serie A', '#c8102e', '#111111', '#ff8a9a', '#7d0a1c', '#170306', 84, '4-2-3-1', '#f4f4f4', '#111111', 'italy'),
  club('torino-zebra', 'Torino Zebras', 'TOR', 'Turim', 'Italia', 'Serie A', '#f4f4f4', '#111111', '#d8d8d8', '#d9d9d9', '#111111', 85, '4-3-3', '#f4d35e', '#111111', 'italy'),
  club('napoli-azz', 'Napoli Azzurri', 'NAP', 'Nápoles', 'Italia', 'Serie A', '#2b9fd8', '#f4f4f4', '#8fe6ff', '#176a94', '#061b26', 84, '4-3-3', '#f4f4f4', '#2b9fd8', 'italy'),
  club('roma-gial', 'Roma Giallorossi', 'ROM', 'Roma', 'Italia', 'Serie A', '#8e1f2f', '#f0bc42', '#ffd884', '#5f0e1a', '#170407', 82, '4-2-3-1', '#f4e3a3', '#8e1f2f', 'italy'),
  club('lazio-eagle', 'Lazio Eagles', 'LAZ', 'Roma', 'Italia', 'Serie A', '#87d3f5', '#f4f4f4', '#d8f4ff', '#5ca7c8', '#102028', 80, '4-3-3', '#f4f4f4', '#87d3f5', 'italy'),
  club('bergamo-atal', 'Bergamo Orobici', 'BER', 'Bérgamo', 'Italia', 'Serie A', '#1e5aa8', '#111111', '#7fb8ff', '#123a6d', '#050b17', 81, '3-4-3', '#f4f4f4', '#111111', 'italy'),
  club('firenze-viola', 'Firenze Viola', 'FIO', 'Florença', 'Italia', 'Serie A', '#6a2c91', '#f4f4f4', '#c79bff', '#411a5c', '#10041a', 79, '4-3-3', '#f4f4f4', '#6a2c91', 'italy'),

  club('munich-red', 'Munich Reds', 'MUN', 'Munique', 'Alemanha', 'Bundesliga', '#dc052d', '#f4f4f4', '#ff8a9a', '#8f031d', '#200308', 88, '4-2-3-1', '#f4f4f4', '#dc052d', 'germany'),
  club('dortmund-yel', 'Dortmund Yellow', 'DOR', 'Dortmund', 'Alemanha', 'Bundesliga', '#fde100', '#111111', '#fff28a', '#b8a300', '#111111', 86, '4-2-3-1', '#f4f4f4', '#111111', 'germany'),
  club('leverkusen-werk', 'Leverkusen Werkself', 'LEV', 'Leverkusen', 'Alemanha', 'Bundesliga', '#e32219', '#111111', '#ff9c9c', '#9e0f0a', '#170303', 85, '3-4-3', '#f4f4f4', '#111111', 'germany'),
  club('leipzig-bull', 'Leipzig Bulls', 'LEI', 'Leipzig', 'Alemanha', 'Bundesliga', '#f4f4f4', '#dd0741', '#ff9fb3', '#d9d9d9', '#8a0428', 83, '4-2-3-1', '#f4f4f4', '#dd0741', 'germany'),
  club('frankfurt-eagle', 'Frankfurt Eagles', 'FRA', 'Frankfurt', 'Alemanha', 'Bundesliga', '#111111', '#e1000f', '#ff9c9c', '#050505', '#8f0009', 82, '4-4-2', '#f4f4f4', '#111111', 'germany'),
  club('stuttgart-swab', 'Stuttgart Swabians', 'STU', 'Stuttgart', 'Alemanha', 'Bundesliga', '#f4f4f4', '#e32219', '#ffb3b8', '#d9d9d9', '#8f0f0a', 81, '4-3-3', '#f4d35e', '#e32219', 'germany'),
  club('gladbach-foal', 'Gladbach Foals', 'GLA', 'Mönchengladbach', 'Alemanha', 'Bundesliga', '#f4f4f4', '#111111', '#b6f0c8', '#d9d9d9', '#111111', 79, '4-2-3-1', '#a3f0c8', '#111111', 'germany'),
  club('bremen-green', 'Bremen Green', 'BRE', 'Bremen', 'Alemanha', 'Bundesliga', '#1d9053', '#f4f4f4', '#9bffce', '#0f5f35', '#041a0d', 78, '4-4-2', '#f4f4f4', '#1d9053', 'germany'),

  club('paris-rouge', 'Paris Rouge', 'PAR', 'Paris', 'Franca', 'Ligue 1', '#0b1f4d', '#d71920', '#8fb8ff', '#071532', '#8f0f14', 87, '4-3-3', '#f4f4f4', '#0b1f4d', 'france'),
  club('marseille-pho', 'Marseille Phocéens', 'MAR', 'Marselha', 'Franca', 'Ligue 1', '#f4f4f4', '#2baee0', '#b8f0ff', '#d9d9d9', '#126a8a', 82, '4-3-3', '#f4d35e', '#2baee0', 'france'),
  club('monaco-rouge', 'Monaco Rouges', 'MON', 'Mônaco', 'Franca', 'Ligue 1', '#e31b23', '#f4f4f4', '#ffb3b8', '#9e0c12', '#220305', 83, '4-4-2', '#f4f4f4', '#e31b23', 'france'),
  club('lyon-gones', 'Lyon Gones', 'LYO', 'Lyon', 'Franca', 'Ligue 1', '#f4f4f4', '#1d5ba4', '#d8e8ff', '#d9d9d9', '#123a6d', 80, '4-2-3-1', '#f4d35e', '#1d5ba4', 'france'),
  club('lille-dogues', 'Lille Dogues', 'LIL', 'Lille', 'Franca', 'Ligue 1', '#d71920', '#1d3b6f', '#ff9c9c', '#8f0f14', '#0d2142', 81, '4-4-2', '#f4f4f4', '#1d3b6f', 'france'),
  club('nice-aigl', 'Nice Aiglons', 'NCE', 'Nice', 'Franca', 'Ligue 1', '#d71920', '#111111', '#ff9c9c', '#8f0f14', '#050505', 79, '4-3-3', '#f4f4f4', '#111111', 'france'),

  club('lisboa-eagle', 'Lisboa Eagles', 'LIS', 'Lisboa', 'Portugal', 'Liga Portugal', '#d71920', '#f4f4f4', '#ff9c9c', '#8f0f14', '#220305', 84, '4-2-3-1', '#f4f4f4', '#d71920', 'portugal'),
  club('porto-dragon', 'Porto Dragons', 'POR', 'Porto', 'Portugal', 'Liga Portugal', '#1d5ba4', '#f4f4f4', '#8fc3ff', '#123a6d', '#061428', 83, '4-3-3', '#f4f4f4', '#1d5ba4', 'portugal'),
  club('sporting-lion', 'Sporting Lions', 'SPO', 'Lisboa', 'Portugal', 'Liga Portugal', '#1d9053', '#f4f4f4', '#9bffce', '#0f5f35', '#041a0d', 83, '3-4-3', '#f4f4f4', '#1d9053', 'portugal'),
  club('braga-arch', 'Braga Archbishops', 'BRA', 'Braga', 'Portugal', 'Liga Portugal', '#d71920', '#f4f4f4', '#ffb3b8', '#8f0f14', '#220305', 79, '4-3-3', '#f4f4f4', '#d71920', 'portugal'),

  club('amsterdam-ajax', 'Amsterdam Ajax', 'AMS', 'Amsterdã', 'Holanda', 'Eredivisie', '#d71920', '#f4f4f4', '#ffb3b8', '#8f0f14', '#220305', 83, '4-3-3', '#f4f4f4', '#d71920', 'netherlands'),
  club('eindhoven-light', 'Eindhoven Lights', 'EIN', 'Eindhoven', 'Holanda', 'Eredivisie', '#d71920', '#f4f4f4', '#ffb3b8', '#8f0f14', '#220305', 82, '4-2-3-1', '#f4f4f4', '#d71920', 'netherlands'),
  club('rotterdam-leg', 'Rotterdam Legions', 'ROT', 'Roterdã', 'Holanda', 'Eredivisie', '#d71920', '#f4f4f4', '#ffb3b8', '#8f0f14', '#220305', 81, '4-3-3', '#f4f4f4', '#d71920', 'netherlands'),
  club('alkmaar-cheese', 'Alkmaar Cheese', 'ALK', 'Alkmaar', 'Holanda', 'Eredivisie', '#d71920', '#f4f4f4', '#ffb3b8', '#8f0f14', '#220305', 78, '4-3-3', '#f4f4f4', '#d71920', 'netherlands'),

  club('rio-rubro', 'Rio Rubro', 'RIO', 'Rio de Janeiro', 'Brasil', 'Brasileirão', '#d71920', '#111111', '#ff9c9c', '#8f0f14', '#050505', 85, '4-2-3-1', '#f4f4f4', '#111111', 'brazil'),
  club('rio-verde', 'Rio Verde', 'RIV', 'Rio de Janeiro', 'Brasil', 'Brasileirão', '#0b6b3a', '#7a1f3d', '#9bffce', '#074525', '#3d0d1e', 81, '4-3-3', '#f4f4f4', '#0b6b3a', 'brazil'),
  club('sao-tricolor', 'São Paulo Tricolor', 'SAO', 'São Paulo', 'Brasil', 'Brasileirão', '#f4f4f4', '#d71920', '#ffb3b8', '#d9d9d9', '#8f0f14', 83, '4-2-3-1', '#f4d35e', '#d71920', 'brazil'),
  club('santos-peixe', 'Santos Peixe', 'SAN', 'Santos', 'Brasil', 'Brasileirão', '#f4f4f4', '#111111', '#d8d8d8', '#d9d9d9', '#111111', 80, '4-3-3', '#f4d35e', '#111111', 'brazil'),
  club('palmeiras-verde', 'Palmeiras Verdão', 'PAL', 'São Paulo', 'Brasil', 'Brasileirão', '#1d9053', '#f4f4f4', '#9bffce', '#0f5f35', '#041a0d', 86, '4-2-3-1', '#f4f4f4', '#1d9053', 'brazil'),
  club('corinthians-tim', 'Corinthians Timão', 'COR', 'São Paulo', 'Brasil', 'Brasileirão', '#111111', '#f4f4f4', '#b8b8b8', '#050505', '#d9d9d9', 82, '4-4-2', '#f4f4f4', '#111111', 'brazil'),
  club('gremio-imortal', 'Grêmio Imortal', 'GRE', 'Porto Alegre', 'Brasil', 'Brasileirão', '#1d5ba4', '#111111', '#8fc3ff', '#123a6d', '#050505', 81, '4-3-3', '#f4f4f4', '#111111', 'brazil'),

  club('buenos-azul', 'Buenos Aires Azul', 'BUE', 'Buenos Aires', 'Argentina', 'Liga Profesional', '#1d3b8f', '#f3c300', '#8fb8ff', '#0f215c', '#8a6e00', 84, '4-3-3', '#f4f4f4', '#1d3b8f', 'argentina'),
  club('river-millo', 'River Millonario', 'RVM', 'Buenos Aires', 'Argentina', 'Liga Profesional', '#f4f4f4', '#d71920', '#ffb3b8', '#d9d9d9', '#8f0f14', 85, '4-3-3', '#f4d35e', '#d71920', 'argentina'),
  club('racing-acad', 'Racing Academia', 'RAC', 'Avellaneda', 'Argentina', 'Liga Profesional', '#7fc3e8', '#f4f4f4', '#d8f4ff', '#4c8aa8', '#d9d9d9', 80, '4-4-2', '#f4f4f4', '#7fc3e8', 'argentina'),
  club('independiente-rojo', 'Independiente Rojo', 'IND', 'Avellaneda', 'Argentina', 'Liga Profesional', '#d71920', '#f4f4f4', '#ff9c9c', '#8f0f14', '#220305', 80, '4-2-3-1', '#f4f4f4', '#d71920', 'argentina'),
  club('san-lorenzo', 'San Lorenzo Cuervo', 'SLO', 'Buenos Aires', 'Argentina', 'Liga Profesional', '#1d3b8f', '#d71920', '#8fb8ff', '#0f215c', '#8f0f14', 79, '4-3-3', '#f4f4f4', '#1d3b8f', 'argentina'),
  club('velez-fortin', 'Vélez Fortín', 'VEL', 'Buenos Aires', 'Argentina', 'Liga Profesional', '#f4f4f4', '#1d3b8f', '#d8e8ff', '#d9d9d9', '#0f215c', 79, '4-4-2', '#f4f4f4', '#1d3b8f', 'argentina'),

  club('america-aguila', 'América Águilas', 'AME', 'Cidade do México', 'Mexico', 'Liga MX', '#f3c300', '#1d3b8f', '#fff28a', '#b89b00', '#0f215c', 82, '4-2-3-1', '#f4f4f4', '#1d3b8f', 'mexico'),
  club('guadalajara-chiva', 'Guadalajara Chivas', 'GDL', 'Guadalajara', 'Mexico', 'Liga MX', '#d71920', '#f4f4f4', '#ffb3b8', '#8f0f14', '#d9d9d9', 80, '4-3-3', '#f4d35e', '#d71920', 'mexico'),
  club('cruz-azul', 'Cruz Azul Cementeros', 'CRA', 'Cidade do México', 'Mexico', 'Liga MX', '#1d5ba4', '#f4f4f4', '#8fc3ff', '#123a6d', '#d9d9d9', 79, '4-2-3-1', '#f4f4f4', '#1d5ba4', 'mexico'),
  club('monterrey-ray', 'Monterrey Rayados', 'MTY', 'Monterrey', 'Mexico', 'Liga MX', '#1d3b8f', '#f4f4f4', '#8fb8ff', '#0f215c', '#d9d9d9', 81, '4-3-3', '#f4f4f4', '#1d3b8f', 'mexico'),

  club('la-galaxy', 'Los Angeles Galaxy', 'LAG', 'Los Angeles', 'EUA', 'MLS', '#f4f4f4', '#1d3b8f', '#d8e8ff', '#d9d9d9', '#0f215c', 78, '4-3-3', '#f4d35e', '#1d3b8f', 'usa'),
  club('seattle-sound', 'Seattle Sounders', 'SEA', 'Seattle', 'EUA', 'MLS', '#1d9053', '#1d3b8f', '#9bffce', '#0f5f35', '#0f215c', 78, '4-2-3-1', '#f4f4f4', '#1d9053', 'usa'),
  club('miami-pink', 'Miami Rosa', 'MIA', 'Miami', 'EUA', 'MLS', '#f5a3c7', '#111111', '#ffd8e8', '#b36c8a', '#050505', 80, '4-3-3', '#f4f4f4', '#111111', 'usa'),

  club('riyadh-hilal', 'Riyadh Hilal', 'HIL', 'Riad', 'Arabia Saudita', 'Saudi Pro League', '#1d5ba4', '#f4f4f4', '#8fc3ff', '#123a6d', '#d9d9d9', 82, '4-2-3-1', '#f4f4f4', '#1d5ba4', 'arabia'),
  club('riyadh-nassr', 'Riyadh Nassr', 'NAS', 'Riad', 'Arabia Saudita', 'Saudi Pro League', '#f3c300', '#1d3b8f', '#fff28a', '#b89b00', '#0f215c', 83, '4-3-3', '#f4f4f4', '#1d3b8f', 'arabia'),
  club('jeddah-ittihad', 'Jeddah Ittihad', 'ITT', 'Jeddah', 'Arabia Saudita', 'Saudi Pro League', '#f3c300', '#111111', '#fff28a', '#b89b00', '#050505', 81, '4-4-2', '#f4f4f4', '#111111', 'arabia'),

  club('istanbul-galata', 'Istanbul Galata', 'GAL', 'Istambul', 'Turquia', 'Süper Lig', '#d71920', '#f3c300', '#ffb3b8', '#8f0f14', '#b89b00', 82, '4-2-3-1', '#f4f4f4', '#d71920', 'turkey'),
  club('istanbul-fener', 'Istanbul Fener', 'FEN', 'Istambul', 'Turquia', 'Süper Lig', '#f3c300', '#0b1f4d', '#fff28a', '#b89b00', '#071532', 82, '4-3-3', '#f4f4f4', '#0b1f4d', 'turkey'),
  club('istanbul-besik', 'Istanbul Besik', 'BES', 'Istambul', 'Turquia', 'Süper Lig', '#111111', '#f4f4f4', '#d8d8d8', '#050505', '#d9d9d9', 80, '4-4-2', '#f4f4f4', '#111111', 'turkey'),

  club('cairo-red', 'Cairo Red', 'CAI', 'Cairo', 'Egito', 'CAF', '#d71920', '#f4f4f4', '#ffb3b8', '#8f0f14', '#d9d9d9', 81, '4-2-3-1', '#f4f4f4', '#d71920', 'africa'),
  club('casablanca-green', 'Casablanca Green', 'CAS', 'Casablanca', 'Marrocos', 'CAF', '#1d9053', '#f4f4f4', '#9bffce', '#0f5f35', '#d9d9d9', 80, '4-3-3', '#f4f4f4', '#1d9053', 'africa'),
  club('johannesburg-gold', 'Johannesburg Gold', 'JOH', 'Joanesburgo', 'Africa do Sul', 'CAF', '#f3c300', '#111111', '#fff28a', '#b89b00', '#050505', 78, '4-4-2', '#f4f4f4', '#111111', 'africa'),
  club('tunis-red', 'Tunis Rouge', 'TUN', 'Túnis', 'Tunisia', 'CAF', '#d71920', '#f3c300', '#ffb3b8', '#8f0f14', '#b89b00', 79, '4-3-3', '#f4f4f4', '#d71920', 'africa'),

  club('tokyo-red', 'Tokyo Reds', 'TOK', 'Tóquio', 'Japao', 'AFC', '#d71920', '#111111', '#ffb3b8', '#8f0f14', '#050505', 79, '4-2-3-1', '#f4f4f4', '#111111', 'asia'),
  club('seoul-tigers', 'Seoul Tigers', 'SEO', 'Seul', 'Coreia do Sul', 'AFC', '#d71920', '#111111', '#ffb3b8', '#8f0f14', '#050505', 78, '4-3-3', '#f4f4f4', '#111111', 'asia'),
  club('shanghai-port', 'Shanghai Port', 'SHA', 'Xangai', 'China', 'AFC', '#d71920', '#f4f4f4', '#ffb3b8', '#8f0f14', '#d9d9d9', 77, '4-2-3-1', '#f4d35e', '#d71920', 'asia'),
  club('sydney-sky', 'Sydney Sky', 'SYD', 'Sydney', 'Australia', 'Oceania', '#7fc3e8', '#f4f4f4', '#d8f4ff', '#4c8aa8', '#d9d9d9', 77, '4-3-3', '#f4f4f4', '#7fc3e8', 'oceania')
]

function seeded(seed) {
  let value = seed
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

function hashString(value) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function makeSquad(team, offset = 0) {
  const rand = seeded(hashString(team.id) + offset * 7919 + team.rating * 17)
  const pool = NAME_POOLS[team.region] || NAME_POOLS.brazil
  const used = new Set()
  return FORMATIONS[team.formation].map(([role, number, x, z, group], index) => {
    let name = ''
    let attempts = 0
    do {
      name = `${pool.first[Math.floor(rand() * pool.first.length)]} ${pool.last[Math.floor(rand() * pool.last.length)]}`
      attempts += 1
    } while (used.has(name) && attempts < 24)
    used.add(name)
    const base = team.rating + (group === 'GK' ? -2 : Math.round((rand() - 0.5) * 7))
    return {
      id: `${team.id}-${number}`,
      name,
      number,
      role,
      group,
      x,
      z,
      pace: 62 + Math.round(rand() * 28) + (group === 'FWD' ? 4 : 0),
      shooting: 55 + Math.round(rand() * 35) + (group === 'FWD' ? 8 : 0),
      passing: 58 + Math.round(rand() * 32) + (group === 'MID' ? 5 : 0),
      defending: 50 + Math.round(rand() * 36) + (group === 'DEF' ? 8 : 0),
      overall: base,
      skin: [0xf0c7a5, 0xdba57e, 0xb97a52, 0x8a5536, 0x6a3f2a, 0xf6d8be][Math.floor(rand() * 6)],
      hair: [0x17110d, 0x2a1b12, 0x4a2d17, 0x0d0d0f, 0x6b4a2a, 0x9a7a4f][Math.floor(rand() * 6)],
      hairStyle: Math.floor(rand() * 3),
      height: 0.94 + rand() * 0.13,
      index
    }
  })
}

export function makeMatchSquads(homeTeam, awayTeam) {
  return {
    home: makeSquad(homeTeam, 1),
    away: makeSquad(awayTeam, 7)
  }
}

export function otherTeams(team) {
  return TEAMS.filter((item) => item.id !== team.id)
}

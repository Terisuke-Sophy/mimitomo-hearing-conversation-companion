-- Insert sample user data
INSERT INTO users (id, display_name, gender, dob) 
VALUES ('5bd4b36e-6867-41d1-8f95-1a334dd9064e', '田中 克己', '男性', '1945-03-10');

-- Insert sample profile items
INSERT INTO profile_items (user_id, category, name, details) VALUES
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', '家族', 'さくら', '一人娘。近くに住んでいる。'),
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', '家族', 'ゆうと', '小学3年生の孫でサッカーが好きな男の子。'),
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', '家族', 'みお', '5歳の孫で絵を描くのが得意な女の子。'),
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', '家族', 'よしえ', '2年前に死別した妻。'),
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', '趣味や好きなこと', '釣り', '若い頃は漁師をしていたので、今でも時々、港へ釣りに行くのが楽しみ。'),
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', '思い出', '桜の木', '亡き妻よしえと一緒に庭で育てていた桜の木が宝物。'),
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', 'その他', 'なめろう', '妻よしえがよく作ってくれたアジのなめろうが好物。'),
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', 'その他', '時計', '時計をつけるのがあまり好きではない'),
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', 'その他', '補聴器', '補聴器をつけるのがあまり好きではない');

-- Insert sample reminders
INSERT INTO reminders (user_id, title, time, is_completed, color) VALUES
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', '朝のお薬', '08:00', true, 'bg-red-300'),
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', '軽い散歩', '10:00', false, 'bg-green-300'),
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', '昼のお薬', '12:30', false, 'bg-red-300'),
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', 'お孫さんと電話', '15:00', false, 'bg-blue-300'),
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', '夜のお薬', '19:00', false, 'bg-red-300');

-- Insert sample memories
INSERT INTO memories (user_id, image_url, caption) VALUES
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', 'https://picsum.photos/id/1018/500/500', '孫のゆうとと山登りに行った時の写真。良い天気だった。'),
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', 'https://picsum.photos/id/1043/500/500', 'みおちゃんの七五三。着物がよく似合っていた。'),
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', 'https://picsum.photos/id/218/500/500', '昔住んでいた港町の風景。懐かしい。'),
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', 'https://picsum.photos/id/30/500/500', '妻と一緒に植えた庭の桜が満開になった。'),
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', 'https://picsum.photos/id/431/500/500', '家族みんなで集まったお正月。賑やかで楽しかったな。'),
('5bd4b36e-6867-41d1-8f95-1a334dd9064e', 'https://picsum.photos/id/553/500/500', '近所の公園。よくここで将棋を指した。');

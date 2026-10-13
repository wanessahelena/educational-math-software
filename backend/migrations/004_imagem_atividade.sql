-- Adiciona suporte a imagens opcionais nas atividades

ALTER TABLE atividade
ADD COLUMN imagem_url VARCHAR(500);
import os

# Directorio para guardar el script temporal
script_dir = "/mnt/data/universal_menu"
os.makedirs(script_dir, exist_ok=True)

# Código del script con menú estilo VexonHub
script_code = """
-- UNIVERSAL MENU v1 by Shine
-- Interfaz tipo VexonHub con toggles para ESP, Aimlock, Speed, Jump y Noclip

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local StarterGui = game:GetService("StarterGui")
local UIS = game:GetService("UserInputService")
local LocalPlayer = Players.LocalPlayer
local Mouse = LocalPlayer:GetMouse()
local Camera = workspace.CurrentCamera

-- SETTINGS
local aimPart = "Head"
local normalSpeed = 16
local fastSpeed = 100
local jumpPower = 100

-- STATES
local espEnabled = false
local aimEnabled = false
local speedEnabled = false
local jumpEnabled = false
local noclipEnabled = false
local dragging = false
local dragInput, dragStart, startPos

-- ESP
local espBoxes = {}

local function createESP(player)
    local box = Drawing.new("Text")
    box.Size = 14
    box.Center = true
    box.Outline = true
    box.Color = Color3.fromRGB(0, 255, 0)
    box.Visible = false
    espBoxes[player] = box
end

local function removeESP(player)
    if espBoxes[player] then
        espBoxes[player]:Remove()
        espBoxes[player] = nil
    end
end

for _, p in pairs(Players:GetPlayers()) do
    if p ~= LocalPlayer then createESP(p) end
end
Players.PlayerAdded:Connect(function(p)
    if p ~= LocalPlayer then createESP(p) end
end)
Players.PlayerRemoving:Connect(removeESP)

RunService.RenderStepped:Connect(function()
    for player, box in pairs(espBoxes) do
        if player.Character and player.Character:FindFirstChild("HumanoidRootPart") and player.Character:FindFirstChild("Humanoid") then
            local pos, onScreen = Camera:WorldToViewportPoint(player.Character.HumanoidRootPart.Position)
            box.Visible = espEnabled and onScreen
            if onScreen and espEnabled then
                box.Text = player.Name .. " [" .. math.floor(player.Character.Humanoid.Health) .. " HP]"
                box.Position = Vector2.new(pos.X, pos.Y - 20)
            end
        else
            box.Visible = false
        end
    end
end)

-- AIMLOCK
local function getClosest()
    local closest, shortest = nil, math.huge
    for _, p in pairs(Players:GetPlayers()) do
        if p ~= LocalPlayer and p.Character and p.Character:FindFirstChild(aimPart) then
            local pos, onScreen = Camera:WorldToViewportPoint(p.Character[aimPart].Position)
            if onScreen then
                local dist = (Vector2.new(Mouse.X, Mouse.Y) - Vector2.new(pos.X, pos.Y)).Magnitude
                if dist < shortest then
                    shortest = dist
                    closest = p
                end
            end
        end
    end
    return closest
end

RunService.RenderStepped:Connect(function()
    if aimEnabled then
        local target = getClosest()
        if target and target.Character and target.Character:FindFirstChild(aimPart) then
            Camera.CFrame = CFrame.new(Camera.CFrame.Position, target.Character[aimPart].Position)
        end
    end
end)

-- Noclip
RunService.Stepped:Connect(function()
    if noclipEnabled and LocalPlayer.Character then
        for _, part in pairs(LocalPlayer.Character:GetDescendants()) do
            if part:IsA("BasePart") and part.CanCollide then
                part.CanCollide = false
            end
        end
    end
end)

-- GUI
local ScreenGui = Instance.new("ScreenGui", game.CoreGui)
ScreenGui.Name = "UniversalMenu"

local Frame = Instance.new("Frame", ScreenGui)
Frame.Size = UDim2.new(0, 220, 0, 240)
Frame.Position = UDim2.new(0.05, 0, 0.1, 0)
Frame.BackgroundColor3 = Color3.fromRGB(30, 30, 30)
Frame.BorderSizePixel = 0
Frame.Active = true
Frame.Draggable = true

local function createToggle(text, yPos, callback)
    local btn = Instance.new("TextButton", Frame)
    btn.Size = UDim2.new(0, 200, 0, 30)
    btn.Position = UDim2.new(0, 10, 0, yPos)
    btn.Text = text .. ": OFF"
    btn.TextColor3 = Color3.new(1, 1, 1)
    btn.BackgroundColor3 = Color3.fromRGB(50, 50, 50)
    btn.MouseButton1Click:Connect(function()
        callback(btn)
    end)
end

createToggle("ESP", 10, function(btn)
    espEnabled = not espEnabled
    btn.Text = "ESP: " .. (espEnabled and "ON" or "OFF")
end)

createToggle("Aimlock", 50, function(btn)
    aimEnabled = not aimEnabled
    btn.Text = "Aimlock: " .. (aimEnabled and "ON" or "OFF")
end)

createToggle("Speed", 90, function(btn)
    speedEnabled = not speedEnabled
    LocalPlayer.Character.Humanoid.WalkSpeed = speedEnabled and fastSpeed or normalSpeed
    btn.Text = "Speed: " .. (speedEnabled and "ON" or "OFF")
end)

createToggle("Super Jump", 130, function(btn)
    jumpEnabled = not jumpEnabled
    LocalPlayer.Character.Humanoid.UseJumpPower = true
    LocalPlayer.Character.Humanoid.JumpPower = jumpEnabled and jumpPower or 50
    btn.Text = "Super Jump: " .. (jumpEnabled and "ON" or "OFF")
end)

createToggle("Noclip", 170, function(btn)
    noclipEnabled = not noclipEnabled
    btn.Text = "Noclip: " .. (noclipEnabled and "ON" or "OFF")
end)

local Close = Instance.new("TextButton", Frame)
Close.Text = "X"
Close.Size = UDim2.new(0, 25, 0, 25)
Close.Position = UDim2.new(1, -30, 0, 5)
Close.BackgroundColor3 = Color3.fromRGB(100, 0, 0)
Close.TextColor3 = Color3.new(1, 1, 1)
Close.MouseButton1Click:Connect(function()
    ScreenGui:Destroy()
end)
"""

# Guardar el archivo .lua
script_path = os.path.join(script_dir, "main.lua")
with open(script_path, "w") as f:
    f.write(script_code)

script_path

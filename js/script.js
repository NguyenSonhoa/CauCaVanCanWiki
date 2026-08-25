const VERSION = "26.1.2";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function icon(name, size = 18) {
  return `<i data-lucide="${name}" style="width:${size}px;height:${size}px"></i>`;
}

function codeBlock(label, code, lang = "text") {
  const id = `code-${Math.random().toString(36).slice(2)}`;
  return `<div class="code-block"><div class="code-head"><span>${escapeHtml(label)}</span><button class="copy-btn" type="button" data-copy-target="${id}">${icon("copy", 14)} Sao chép</button></div><pre><code id="${id}" data-lang="${escapeHtml(lang)}">${escapeHtml(code.trim())}</code></pre></div>`;
}

function table(headers, rows) {
  return `<div class="table-wrap"><table><thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function callout(type, html) {
  return `<div class="callout ${type || ""}">${html}</div>`;
}

function pills(items, style = "") {
  return `<div class="pill-list">${items.map((item) => `<span class="pill ${style}">${item}</span>`).join("")}</div>`;
}

const snippets = {
  install: `
plugins/
  CauCaVanCanCore.jar
  packetevents-spigot.jar       # bắt buộc
  MMOItems.jar                  # cần cho mồi/phần thưởng MMOItems
  MythicMobs.jar                # tùy chọn, dùng cá Mythic và MYTHIC_* skill
  Vault.jar + economy plugin    # tùy chọn, cần để bán cá / reset tính năng Vault
  PlayerPoints.jar              # tùy chọn, dùng boost/reset khi cấu hình
  WorldGuard.jar                # tùy chọn, dùng region hồ
  KaMenu.jar                    # tùy chọn, dùng attribute dialog
`,
  files: `
plugins/CauCaVanCanCore/
  config.yml                    # battle, EXP, message, reset, database
  character-core.yml            # level, thuộc tính, stat, skill character
  bait.yml                      # toàn bộ mồi và hiệu ứng
  fishing-skills.yml            # skill câu cá native, stamina MMOCore
  fish/
    spawns.yml                  # hồ/region, tỉ lệ cá/rác, cá độc quyền
    categories/
      01_cap_chuc_can/
        _category.yml
        TEN_CA.yml
  loot.yml                      # reward MMOItems + rarity/classification
  premium-pools.yml             # hồ premium và nguồn cá
  daily-quests.yml              # nhiệm vụ ngày
  tug-pvp.yml                   # PvP tranh cá
  gui/                          # toàn bộ chest menu và KaMenu dialog
  skills/                       # character skill tree/definition
  mmoitems/                     # mapping/kiểu item MMOItems
`,
  fish: `
# plugins/CauCaVanCanCore/fish/categories/02_cap_tram_can/VUONG_CA_CHEP.yml
mythicmob: "wolfmob38"          # ID mob Mythic để hiện lúc battle (nếu có)
mmoitems: {type: FISH, id: VUONG_CA_CHEP}
fish-weight:
  min: 100
  max: 500                      # min = max nếu muốn cân nặng cố định
health: 1200.0
pull-per-second: 10.0
max-safe-distance: 10.0
line-penalty-per-second: 10.0
rarity: LARGE
shadow-size: 1.0                # chỉ scale bóng cá; hợp lệ 0.05 đến 10
required-level: 1
fish-health-bar:
  color: RED
  style: NOTCHED_10
  title: "&c%fish_name% &7%fish_health%/%max_fish_health%"
`,
  spawn: `
# fish/spawns.yml
worlds:
  world:
    regions:
      ho_bo_hoang:
        required-level: 1
        trash-chance: 0.15
        fish:                    # tổng phần trăm BẮT BUỘC đúng 100
          CA_CHEP_DO_DOT_BIEN: 45
          CA_CHEP_XANH_DI_BIEN: 40
          VUONG_CA_CHEP: 15
        exclusive-fish:
          - VUONG_CA_CHEP         # ID này cũng phải nằm trong fish
        trash:                    # tổng đúng 100 khi trash-chance > 0
          old_boot: 50
          rusty_can: 50
`,
  premium: `
# premium-pools.yml
pools:
  premium_lake:
    enabled: true
    required-level: 31
    world: world
    regions: [premium_lake]
    permission: caucavancan.premium
    source-pools:
      - ho_bo_hoang
      - ho_nha_may_dien_hat_nhan
    exit: {world: world, x: 0.5, y: 64.0, z: 0.5, yaw: 0.0, pitch: 0.0}
    modifiers:
      trash-chance: 0.0
      excluded-rarities: [SMALL, MEDIUM]
      large-rarity-bonus: 0.05
`,
  sell: `
# gui/sell-menu.yml
price-formula: "rate * weight * amount * multiplier"

# rate: fish-prices[ID] nếu có, nếu không lấy bậc cân nặng tương ứng.
fish-prices:
  VUONG_CA_CHEP: 25.0
weight-price-tiers:
  tram-can: {min-weight: 100, max-weight: 1000, price-per-kg: 3}
  ngan-can: {min-weight: 1000, max-weight: 10000, price-per-kg: 8}
fish-price-multipliers:
  default: 1.0
  LARGE: 1.0
  EXCLUSIVE: 1.5
`,
  bait: `
# bait.yml
require-bait: true
items:
  EXCLUSIVE_1:
    mmoitems: {type: BAIT, id: EXCLUSIVE_1}
    effects:
      exclusive-chance: 0.10
    accepted-mmoitems: []
    bait-type: EXCLUSIVE
  EXPLOSIVE_1:
    mmoitems: {type: BAIT, id: EXPLOSIVE_1}
    effects:
      damage: 0.10
      instant-kill-chance: 0.02
    bait-type: EXPLOSIVE
defaults:
  EXCLUSIVE: EXCLUSIVE_1
  EXPLOSIVE: EXPLOSIVE_1
`,
  character: `
# character-core.yml
level:
  max: 250
  exp:
    formula: {base: 180.0, exponent: 2.05}
  rewards:
    attribute-points: 3
    skill-points: {every-levels: 5, amount: 1}
attributes:
  khoe:
    display-name: "&c&lKhoẻ"
    stats: {health: 5.0, pull-power: 1.0}
  dep:
    display-name: "&d&lĐẹp"
    stats: {rare-fish-chance: 1.0, pull-critical: 0.5}
  khon:
    display-name: "&b&lKhôn"
    stats: {mana: 5.0, skill-critical: 0.5}
`,
  mythic: `
# plugins/MythicMobs/skills/ccvc_hook_strike.yml
CCVC_HOOK_STRIKE:
  Skills:
    - effect:particles{p=CRIT;amount=18} @target
    - damage{a=<skill.var.ccvc_skill_damage>;ia=true} @target

# CCVC gửi biến <skill.var.ccvc_skill_damage> và <skill.power>.
# Không hard-code a=25 nếu muốn skill CCVC/level/stat quyết định damage.
`,
  skill: `
# skills/definitions/moc-cau.yml
id: moc-cau
display-name: "&bMóc Câu"
category: hang-ngu-thap-bat-dieu
icon: {material: TRIPWIRE_HOOK}
max-level: 5
cooldown-millis: 8000
execution:
  type: MYTHIC_PLAYER
  id: CCVC_HOOK_STRIKE
  skill-damage: {base: 25.0, per-level: 5.0}
requirements: {level: 1, permission: [], quest: [], skills: {}}
upgrade:
  cost: {skill-points: 1, gold: 0, donate-points: 0}
`,
  api: `
import com.rozen.caucavancancore.CauCaVanCanCore;
import com.rozen.caucavancancore.api.FishingApi;
import org.bukkit.plugin.RegisteredServiceProvider;

RegisteredServiceProvider<FishingApi> registration = getServer()
    .getServicesManager().getRegistration(FishingApi.class);
FishingApi api = registration == null ? null : registration.getProvider();

if (api != null && api.session(player).isPresent()) {
    api.damageFish(player, 25.0);
    api.addExp(player, 100.0);
}
`,
  listener: `
@EventHandler(ignoreCancelled = true)
public void onFishingPull(FishingPullEvent event) {
    if (event.getFish().rarity().equalsIgnoreCase("LARGE")) {
        event.setDamage(event.getDamage() * 1.15);
    }
}
`,
  build: `
git clone https://github.com/NguyenSonhoa/CauCaVanCanCore.git
cd CauCaVanCanCore
mvn -DskipTests package
# target/CauCaVanCanCore.jar
`
};

const sections = [
  {
    id: "home", title: "Tổng quan", icon: "fish", keywords: "home overview ccvc cau ca van can core fishing minecraft", desc: "CauCaVanCanCore là hệ thống câu cá chiến đấu, tiến trình nhân vật, hồ, cá, mồi, kỹ năng và tích hợp Minecraft.",
    html: `
      <div class="content-grid">
        <div class="doc-card">
          <div class="stat-row"><div class="stat"><strong>${VERSION}</strong><span>Phiên bản tài liệu</span></div><div class="stat"><strong>Java 25</strong><span>Maven/source hiện tại</span></div><div class="stat"><strong>9</strong><span>GUI config mặc định</span></div><div class="stat"><strong>API</strong><span>Service + Bukkit events</span></div></div>
          <h3 class="mt-6">Core làm gì?</h3>
          <p>CCVC biến việc câu cá thành một trận chiến có bóng cá, cá Mythic, máu cá, dây cước, kéo cá, boss bar và reward hologram. Mỗi hồ có bảng spawn riêng, giới hạn level, rác, cá thường và cá độc quyền. Hệ thống còn có cân nặng, giá bán, EXP, thuộc tính <code>Khoẻ - Đẹp - Khôn</code>, skill tree, mồi, premium pool, PvP tranh cá, boost và nhiệm vụ ngày.</p>
          ${pills(["/fish", "/att", "/skill", "WorldGuard", "MMOItems", "MythicMobs", "KaMenu dialog", "PlaceholderAPI", "Developer API"], "good")}
        </div>
        <div class="doc-card half"><h3>Quy tắc vận hành quan trọng</h3><ol><li>Trong phiên câu, cần câu phải giữ ở hotbar slot 7 (ô thứ 7); không đặt/cầm cần ở ô khác để câu.</li><li><code>fish/spawns.yml</code> xác định cá có thể cắn câu. Mọi ID trong <code>fish</code>, <code>exclusive-fish</code> và <code>loot.yml</code> phải khớp nhau.</li><li>Không dùng lệnh server <code>/reload</code>; dùng <code>/fish reload</code> hoặc restart sau khi đổi resource/config lớn.</li><li>Các config có ghi chú <code>#</code> là tài liệu tại chỗ; wiki này giải thích logic và ràng buộc.</li></ol></div>
        <div class="doc-card half"><h3>Phân loại cá</h3>${table(["Loại", "Ý nghĩa"], [["<code>SMALL</code>, <code>MEDIUM</code>", "Cá thường theo rarity."],["<code>LARGE</code>", "Nhóm cá lớn/hiếm; được <code>large-rarity-bonus</code> của hồ premium tác động."],["<code>VERY_LARGE</code>", "Cá rất lớn; không bị bonus <code>LARGE</code> mặc định tác động."],["<code>EXCLUSIVE</code>", "Không phải rarity YAML riêng: một fish trở thành độc quyền khi ID nằm trong <code>exclusive-fish</code> của hồ."]])}</div>
      </div>`
  },
  {
    id: "install", title: "Cài đặt", icon: "download", keywords: "install installation requirement dependency packetevents java maven", desc: "Jar bắt buộc, dependency tùy chọn, khởi tạo lần đầu và build source.",
    html: `<div class="content-grid"><div class="doc-card half"><h3>Yêu cầu</h3>${table(["Thành phần", "Trạng thái", "Mục đích"], [["Paper/Spigot API 26.1.2", "Server target", "API của bản core hiện tại."],["Java 25", "Build/source", "Dùng để build bản Maven hiện tại."],["PacketEvents", "Bắt buộc", "Packet/boss bar/hiển thị phiên câu."],["SQLite JDBC", "Đóng gói", "Lưu player data/leaderboard."],["MMOItems", "Tùy chọn nhưng gần như cần", "Mồi và reward fish MMOItems."],["MythicMobs", "Tùy chọn", "Mythic fish và bridge skill."],["Vault + economy", "Tùy chọn", "Bán cá; reset theo cấu hình Vault."],["PlayerPoints", "Tùy chọn", "Boost/reset theo cấu hình PlayerPoints."],["WorldGuard", "Tùy chọn", "Hồ theo region."],["KaMenu", "Tùy chọn", "Attribute dialog thay GUI chest."]])}</div><div class="doc-card half"><h3>Đặt jar và khởi động</h3><ol><li>Đặt <code>CauCaVanCanCore.jar</code> và PacketEvents vào <code>plugins/</code>.</li><li>Đặt các plugin tích hợp bạn dùng; tên plugin phải đúng như dependency của server.</li><li>Khởi động server để CCVC tạo <code>plugins/CauCaVanCanCore/</code>.</li><li>Cấu hình MMOItems/MythicMobs trước nếu reward/cá đang tham chiếu chúng.</li><li>Restart hoặc dùng <code>/fish reload</code> sau khi chỉnh YAML hợp lệ.</li></ol>${codeBlock("plugins/", snippets.install)}</div><div class="doc-card">${callout("warn", "Nếu <code>require-bait: true</code>, người chơi cần mồi hợp lệ. Nếu <code>loot.yml</code> dùng reward MMOItems nhưng MMOItems/item ID chưa tồn tại, câu được cá sẽ không thể tạo reward.")}<h3>Build từ source</h3>${codeBlock("PowerShell / terminal", snippets.build, "bash")}</div></div>`
  },
  {
    id: "files", title: "Cấu trúc config", icon: "folder-tree", keywords: "files folders config yaml gui loot spawns category", desc: "Mỗi file điều khiển một phạm vi riêng để dễ tìm và sửa.",
    html: `<div class="content-grid"><div class="doc-card">${codeBlock("plugins/CauCaVanCanCore", snippets.files)}${callout("", "Các file cá được nạp đệ quy từ <code>fish/categories/</code>. Quy ước thư mục <code>01_</code>, <code>02_</code>... quyết định thứ tự rõ ràng; còn <code>index</code> trong <code>_category.yml</code> quyết định thứ tự collection.")}</div><div class="doc-card half"><h3>Luồng dữ liệu cá</h3><ol><li>File category/fish định nghĩa máu, weight, rarity, level và fish model.</li><li><code>fish/spawns.yml</code> chọn fish theo hồ/region.</li><li><code>loot.yml</code> gắn rarity/classification/reward MMOItems cho mọi fish được spawn.</li><li><code>gui/fish-collection.yml</code> chỉ điều khiển cách các ID hiện trong bộ sưu tập.</li></ol></div><div class="doc-card half"><h3>Thứ tự reload an toàn</h3><ol><li>Kiểm tra YAML không tab, thụt lề bằng space.</li><li>Sửa fish + spawns + loot đồng bộ.</li><li>Nếu đổi Mythic skill: <code>/mm reload</code> trước.</li><li>Dùng <code>/fish reload</code>; restart khi nạp MMOItems stat/type hoặc file plugin khác.</li></ol></div></div>`
  },
  {
    id: "fishing", title: "Vòng lặp câu cá", icon: "anchor", keywords: "fishing hotbar slot 7 rod battle shadow health line pull hologram", desc: "Từ lúc ném cần đến khi nhận cá, EXP và hologram.",
    html: `<div class="content-grid"><div class="doc-card"><h3>Trình tự phiên câu</h3>${table(["Bước", "Hành vi core"], [["1. Chuẩn bị", "Cần câu ở hotbar slot 7 (ô thứ 7) và mồi hợp lệ nếu bật <code>require-bait</code>."],["2. Cắn câu", "Core lấy bảng spawn theo world/WorldGuard region, level, mồi và modifier premium."],["3. Bóng cá", "ItemDisplay/Shadow chạy tới phao. <code>shadow-size</code> của fish chỉ đổi kích thước bóng."],["4. Battle", "CCVC tạo fish session: máu cá, dây cước, khoảng cách, pull, critical, boss bar và cá Mythic nếu có."],["5. Kéo cá", "Người chơi kéo đúng lúc để gây damage; cá kéo ngược và có thể làm căng/đứt dây."],["6. Thành công", "Cá về inventory từ MMOItems, PDC/lore nhận weight, core cộng EXP, quest/stats và hologram thông báo cá + EXP."],["7. Kết thúc", "Kết quả có thể là <code>CAUGHT</code>, <code>LINE_BROKEN</code>, <code>CANCELLED</code>, <code>PLAYER_DIED</code>, <code>LEFT_WATER</code>, <code>HOTBAR_CHANGED</code>."]])}</div><div class="doc-card half"><h3>Cần và hotbar</h3><p>Slot 7 là vị trí index <code>6</code> trong API inventory, nhưng là ô số <strong>7</strong> đối với người chơi. Core giữ slot này cho cần trong lúc câu; skill dùng các key loadout khác. Đổi hotbar hoặc rời nước sẽ kết thúc phiên câu để chống exploit.</p>${callout("warn", "Không đặt cần ở slot khác rồi mong bắt đầu câu. Hãy để cần ở ô số 7 trước khi ném.")}</div><div class="doc-card half"><h3>Config battle chính</h3><p><code>config.yml</code> chứa rod mặc định, boss bar máu cá/dây, cảnh báo pull, reward hologram, message, default fish weight, EXP hồ và rank rarity. File fish riêng ghi đè thuộc tính của từng loài.</p><p><code>shadow-size</code> hợp lệ từ <code>0.05</code> đến <code>10.0</code>. Dùng <code>/fish shadowtest [scale] [SMALL|MEDIUM|LARGE|VERY_LARGE]</code> (admin) để thử visual, và <code>/fish shadowtest remove</code> để xóa test display.</p></div></div>`
  },
  {
    id: "fish", title: "Cá, rarity và cân nặng", icon: "waves", keywords: "fish rarity weight fish weight shadow size category loot mmoitems", desc: "Tạo cá mới, chỉnh cỡ bóng, cân nặng, rarity, battle và reward.",
    html: `<div class="content-grid"><div class="doc-card">${codeBlock("một file cá", snippets.fish, "yaml")}</div><div class="doc-card half"><h3>Ý nghĩa key fish</h3>${table(["Key", "Tác dụng"], [["<code>mythicmob</code>", "MythicMob ID của cá chiến đấu; phải tồn tại khi bạn muốn spawn Mythic."],["<code>mmoitems.type/id</code>", "Item reward/nhận diện MMOItems của cá."],["<code>fish-weight.min/max</code>", "Cân nặng thực tế random mỗi lần câu. Đây là nơi duy nhất để đặt cân nặng thật."],["<code>health</code>, <code>pull-per-second</code>", "Máu cá và sức kéo cơ bản."],["<code>max-safe-distance</code>, <code>line-penalty-per-second</code>", "Ngưỡng khoảng cách và mức hao dây."],["<code>rarity</code>", "SMALL/MEDIUM/LARGE/VERY_LARGE, dùng rarity rank, premium filter và giá modifier."],["<code>required-level</code>", "Chưa đủ cấp thì fish không được chọn để cắn."],["<code>shadow-size</code>", "Kích thước bóng cá, không phải cân nặng/HP/damage."]])}</div><div class="doc-card half"><h3>Category</h3><p>Tạo <code>_category.yml</code> trong mỗi folder category. Core tự nạp các file fish cùng thư mục; <code>display-name</code> và <code>index</code> phục vụ collection. Không cần lặp danh sách fish, trừ khi bạn có mục đích riêng với <code>fishes</code>.</p>${callout("", "Cân nặng tham chiếu trong <code>config.yml → stats.exp.pools</code> chỉ tính bonus EXP theo weight. Nó <strong>không</strong> random hoặc đặt cân nặng cá.")}</div></div>`
  },
  {
    id: "pools", title: "Hồ, cá độc quyền, premium", icon: "map", keywords: "pools worldguard regions spawns exclusive premium lake large trash chance", desc: "Tạo hồ thường, cá độc quyền mỗi hồ và hồ premium theo nhóm nguồn.",
    html: `<div class="content-grid"><div class="doc-card half"><h3>Hồ thường</h3>${codeBlock("fish/spawns.yml", snippets.spawn, "yaml")}<p><code>fish</code> là bảng trọng số theo phần trăm: tổng phải là <strong>100</strong>. <code>trash</code> cũng phải đúng 100 nếu có dùng. <code>required-level</code> thuộc hồ, còn <code>required-level</code> trong file fish là điều kiện riêng của loài.</p></div><div class="doc-card half"><h3>Cá độc quyền</h3><p>Độc quyền được định nghĩa <strong>theo hồ</strong>, không theo rarity. Đặt ID cá trong <code>exclusive-fish</code> của đúng region. Cá đó vẫn phải có trong map <code>fish</code> cùng hồ và phải có reward trong <code>loot.yml</code>.</p>${callout("warn", "Lỗi <code>exclusive-fish id must also be in fish</code> nghĩa là một ID exclusive thiếu ở map <code>fish</code> của chính hồ. Lỗi <code>Unknown fish id</code> nghĩa là file fish/category chưa cung cấp ID đó.")}</div><div class="doc-card"><h3>Hồ premium</h3>${codeBlock("premium-pools.yml", snippets.premium, "yaml")}<p>Premium pool thu thập fish + exclusive fish của các <code>source-pools</code>. Người chơi cần permission của hồ (mặc định <code>caucavancan.premium</code>) hoặc ticket premium còn hạn. <code>excluded-rarities</code> chỉ lọc cá thường; exclusive fish của hồ nguồn vẫn được giữ. <code>large-rarity-bonus: 0.05</code> tăng 5% trọng số cá thường <code>LARGE</code>, không tăng exclusive và không tăng <code>VERY_LARGE</code>.</p></div></div>`
  },
  {
    id: "loot-sell", title: "Loot, EXP và bán cá", icon: "coins", keywords: "loot rewards exp sell price formula money weight multiplier hologram", desc: "Cấu hình reward MMOItems, EXP theo hồ và công thức giá bán theo kg.",
    html: `<div class="content-grid"><div class="doc-card half"><h3>Loot bắt buộc</h3><p>Mỗi fish có thể spawn cần một entry ở <code>loot.yml → rewards</code>. Entry chứa <code>rarity</code>, <code>classification</code>, <code>weight</code> (trọng số loot) và <code>mmoitems.type/id</code>. <code>classification</code> điều khiển battle, không thay nguồn reward.</p>${callout("danger", "Lỗi <code>loot.yml is missing rewards for configured fish</code> không phải lỗi mơ hồ: hãy thêm reward cho mọi ID xuất hiện trong bất kỳ bảng <code>fish</code> nào.")}</div><div class="doc-card half"><h3>EXP câu cá</h3><p><code>config.yml → stats.exp</code> dùng công thức: <code>base của hồ × hệ số loại cá × bonus cân nặng</code>, sau đó mới áp dụng stat <code>exp-multiplier</code> và EXP boost. <code>fish-multipliers.exclusive</code> tự áp dụng khi fish thuộc <code>exclusive-fish</code>; <code>fish-overrides</code> có ưu tiên cao nhất.</p><p>Hologram thành công lấy cấu hình message/hologram trong <code>config.yml</code>, hiển thị fish nhận được và EXP tính từ catch đó.</p></div><div class="doc-card">${codeBlock("giá bán", snippets.sell, "yaml")}<p>Biến công thức hỗ trợ: <code>rate</code> (giá/kg), <code>weight</code> (cân thực tế), <code>amount</code> (số lượng) và <code>multiplier</code> (hệ số rarity/exclusive). Công thức mặc định đúng theo quy ước: <strong>Giá bán = giá/kg × cân nặng thực tế × số lượng × hệ số thưởng</strong>.</p>${callout("", "<code>fish-prices[ID]</code> là giá/kg riêng và ưu tiên hơn <code>weight-price-tiers</code>. Hệ số <code>EXCLUSIVE</code> được ưu tiên trước rarity khi cá là độc quyền của hồ.")}</div></div>`
  },
  {
    id: "bait", title: "Mồi và hộp mồi", icon: "package-open", keywords: "bait lure explosive weakening exclusive mmoitems bait box", desc: "Năm loại mồi, MMOItems mapping, hiệu ứng và cách cấp mồi.",
    html: `<div class="content-grid"><div class="doc-card half"><h3>Loại mồi</h3>${table(["Bait type", "Hiệu ứng YAML"], [["<code>NORMAL</code>", "Mồi nền."],["<code>LURE</code>", "<code>bite-bonus</code>, <code>wait-reduction</code>."],["<code>EXPLOSIVE</code>", "<code>damage</code>, <code>instant-kill-chance</code>, visual/sound ngưỡng damage."],["<code>WEAKENING</code>", "<code>weaken</code> để làm yếu cá."],["<code>EXCLUSIVE</code>", "<code>exclusive-chance</code>; chỉ tăng nhóm cá độc quyền của hồ."]])}</div><div class="doc-card half"><h3>MMOItems</h3><p>CCVC map mồi từ MMOItems bằng <code>mmoitems.type</code> + <code>mmoitems.id</code>. Project có type <code>BAIT</code> ở <code>mmoitems/item-types.yml</code>; thêm cùng type vào MMOItems của server. <code>accepted-mmoitems</code> cho phép thêm ID MMOItems khác vào cùng ô mồi.</p>${callout("", "Tên, lore, material và model của bait MMOItems do MMOItems quản lý. CCVC chỉ kiểm tra/tiêu mồi và áp dụng effect.")}</div><div class="doc-card">${codeBlock("bait.yml", snippets.bait, "yaml")}<p>Mở hộp mồi bằng <code>/fish box</code>. Cấp mồi: <code>/fish givebait [player] &lt;bait-id&gt; &lt;amount&gt;</code> (admin). Khi chỉ có ba tham số, người dùng nhận mồi cho chính mình; console phải chỉ định player.</p></div></div>`
  },
  {
    id: "character", title: "Nhân vật và thuộc tính", icon: "heart-pulse", keywords: "character level exp attribute khoe dep khon stat reset playerpoints vault", desc: "Level, điểm thuộc tính, Khoẻ - Đẹp - Khôn, stat mapping và reset có phí.",
    html: `<div class="content-grid"><div class="doc-card">${codeBlock("character-core.yml", snippets.character, "yaml")}</div><div class="doc-card half"><h3>Ba thuộc tính</h3>${table(["Thuộc tính", "Stat mặc định mỗi điểm"], [["Khoẻ", "<code>health +5</code>, <code>pull-power +1</code>."],["Đẹp", "<code>rare-fish-chance +1</code>, <code>pull-critical +0.5</code>."],["Khôn", "<code>mana +5</code>, <code>skill-critical +0.5</code>."]])}<p>Không cần hard-code lore kiểu “cộng điểm nào tăng cái nào”: dialog/menu đọc <code>attributes.*.stats</code> và stat breakdown từ config để hiển thị.</p></div><div class="doc-card half"><h3>Reset /att</h3><p><code>/att</code> mở attribute menu/dialog. <code>/att reset</code> reset điểm đã cộng về 0 và trả lại điểm. Cùng hành động reset cũng có nút trong <code>gui/attribute-dialog.yml</code> với action <code>ccvc:attribute-reset</code>.</p><p>Phí reset, provider Vault/PlayerPoints, format và message ở một vùng <code>attribute-reset</code> trong <code>config.yml</code>. Cấu hình đúng provider đang có; không bật phí PlayerPoints nếu plugin/service đó vắng mặt.</p></div><div class="doc-card"><h3>Stat mở rộng và MMOItems</h3><p><code>base-stats</code> khai báo stat nền. <code>item-stat-mapping</code> nối ID stat CCVC tới ID stat MMOItems/MythicLib như <code>FISHING_POWER</code>, <code>RARE_FISH_CHANCE</code>, <code>LINE_STRENGTH</code>. Có thể thêm stat ID mới vào config; developer/plugin khác có thể lấy bằng API <code>getStat</code> và <code>getStatBreakdown</code>.</p></div></div>`
  },
  {
    id: "skills", title: "Kỹ năng", icon: "sparkles", keywords: "skill character tree loadout mythicmobs stamina mmocore damage", desc: "Skill tree, hotbar loadout, skill native, stamina MMOCore và MythicMobs bridge.",
    html: `<div class="content-grid"><div class="doc-card half"><h3>Skill CCVC</h3><p><code>skills/categories/</code> chứa category; <code>skills/definitions/</code> chứa definition. Người chơi mở loadout bằng <code>/skill</code> hoặc <code>/fish skills</code>, tree bằng <code>/skill tree</code>. Bind skill vào các key 1-6; cần câu vẫn ở key/slot 7.</p>${codeBlock("skill definition", snippets.skill, "yaml")}</div><div class="doc-card half"><h3>Skill native và stamina</h3><p><code>fishing-skills.yml</code> cấu hình skill native (ví dụ <code>dieu-hon</code>). <code>stamina-cost</code> là stamina MMOCore bị trừ cho <strong>mỗi lần</strong> cast. Đặt <code>0</code> để không tiêu stamina. Nếu người chơi thiếu stamina, core không cast skill và không bắt đầu cooldown.</p><p>Skill definition có requirement level/permission/quest/skill, upgrade cost skill points/gold/donate points và stats theo level.</p></div><div class="doc-card"><h3>MythicMobs: damage đúng cách</h3>${codeBlock("MythicMobs skill", snippets.mythic, "yaml")}<p><code>MYTHIC_PLAYER</code> có caster là người câu và target là cá trong CCVC session. Core gửi <code>&lt;skill.var.ccvc_skill_damage&gt;</code> và <code>&lt;skill.power&gt;</code>, đồng thời intercept damage Mythic để trừ vào thanh máu CCVC. <code>MYTHIC_FISH</code> dành cho effect/skill từ phía cá. Dùng biến do core cấp để skill damage theo level/stat thay vì hard-code damage trong MythicMobs.</p></div></div>`
  },
  {
    id: "menus", title: "GUI và KaMenu dialog", icon: "panels-top-left", keywords: "gui menu kamenu dialog attribute dialog main menu position button format", desc: "Chest GUI YAML và attribute dialog hoàn toàn có thể chỉnh vị trí, thứ tự, text và format.",
    html: `<div class="content-grid"><div class="doc-card half"><h3>GUI chest</h3>${table(["File", "Chức năng"], [["<code>main-menu.yml</code>", "Menu /fish chest: bait, skill, collection, sell, admin controls."],["<code>bait-box.yml</code>", "5 ô loại mồi."],["<code>skill-menu.yml</code>", "Loadout, key bind và consumable."],["<code>character-skill-menu.yml</code>", "Skill tree/category/upgrade."],["<code>fish-collection.yml</code>", "Collection theo category và page."],["<code>sell-menu.yml</code>", "Ô input cá, price formula, filler, sell button."],["<code>boost-menu.yml</code>", "Mua boost PlayerPoints."],["<code>attribute-menu.yml</code>", "Fallback attribute chest menu."]])}</div><div class="doc-card half"><h3>KaMenu attribute dialog</h3><p>Nếu KaMenu có mặt, core dùng <code>gui/attribute-dialog.yml</code>. File này có <code>dialog</code>, <code>body</code>, <code>type: multi</code>, <code>columns</code>, và <code>buttons</code>. Thứ tự button là thứ tự dưới <code>buttons</code>; số cột thay layout. Mỗi button dùng action như <code>ccvc:attribute khoe</code>, <code>ccvc:attribute dep</code>, <code>ccvc:attribute khon</code>, hoặc <code>ccvc:attribute-reset</code>.</p>${callout("", "Text/tooltip của nút reset được nạp từ <code>config.yml → attribute-reset.dialog</code>, để phí, provider và wording không bị tách ra nhiều file.")}</div><div class="doc-card"><h3>Quy tắc format</h3><p>Hầu hết text hỗ trợ màu <code>&amp;</code>, hex <code>&amp;#RRGGBB</code>/<code>#RRGGBB</code> và Adventure hex <code>&lt;#RRGGBB&gt;</code> tại nơi core xử lý format. Luôn quote YAML có ký tự đặc biệt <code>:</code>, <code>#</code>, <code>{}</code>, <code>[]</code> hoặc placeholder phức tạp.</p></div></div>`
  },
  {
    id: "commands", title: "Lệnh và quyền", icon: "terminal", keywords: "commands permission fish att skill admin premium reload givebait boost", desc: "Lệnh người chơi, lệnh admin và permission node có trong plugin.yml.",
    html: `<div class="content-grid"><div class="doc-card"><h3>Lệnh người chơi</h3>${table(["Lệnh", "Tác dụng"], [["<code>/fish</code> hoặc <code>/fishing</code>", "Command root; các subcommand dưới đây."],["<code>/fish box</code>", "Mở hộp mồi."],["<code>/fish sell</code>", "Mở menu bán cá."],["<code>/fish chest</code>", "Mở menu chính."],["<code>/fish skills</code>", "Mở skill loadout."],["<code>/fish collection</code> / <code>index</code>", "Mở bộ sưu tập cá."],["<code>/fish boost</code>", "Mở boost menu và báo trạng thái boost."],["<code>/att</code>", "Mở thuộc tính/dialog."],["<code>/att reset</code>", "Reset attribute và hoàn điểm theo phí cấu hình."],["<code>/skill</code> / <code>loadout</code>", "Mở skill loadout."],["<code>/skill tree</code> / <code>learn</code>", "Mở skill tree."]])}</div><div class="doc-card"><h3>Lệnh admin</h3>${table(["Lệnh", "Quyền", "Ghi chú"], [["<code>/fish reload</code>", "<code>caucavancan.admin</code>", "Nạp lại cấu hình core."],["<code>/fish givebait [player] &lt;id&gt; &lt;amount&gt;</code>", "admin", "Cấp mồi ID trong bait.yml."],["<code>/fish shadowtest ...</code>", "admin", "Thử scale bóng cá."],["<code>/fish boost[global] &lt;type&gt; &lt;percent&gt; &lt;seconds&gt;</code>", "admin", "EXP/GOLD/WEAKEN/POWER/EXCLUSIVE."],["<code>/fish character setlevel|addexp|addatt|addskill &lt;player&gt; &lt;amount&gt;</code>", "<code>caucavancan.character.admin</code>", "Sửa character data online."],["<code>/fish skill points give|set|remove &lt;player&gt; &lt;amount&gt;</code>", "character.admin", "Sửa skill points."],["<code>/fish skill unlock &lt;player&gt; &lt;skill-id&gt; [level]</code>", "character.admin", "Bypass requirement/cost."],["<code>/fish premium grant &lt;player&gt; &lt;seconds&gt;</code>", "<code>caucavancan.premium.admin</code>", "Cấp ticket premium."],["<code>/fish premium revoke &lt;player&gt;</code>", "premium.admin", "Thu ticket premium."],["<code>/fish categorystat &lt;category&gt;</code>", "admin", "Tạo MMOItems category damage stats."]])}</div><div class="doc-card">${pills(["caucavancan.admin", "caucavancan.character.admin", "caucavancan.premium", "caucavancan.premium.admin"], "warn")}<p><code>caucavancan.premium</code> là permission nhập hồ premium mặc định; từng pool có thể đặt node riêng trong <code>premium-pools.yml</code>.</p></div></div>`
  },
  {
    id: "extra", title: "Boost, quest và PvP", icon: "swords", keywords: "boost quests daily tug pvp premium ticket leaderboards", desc: "Các hệ thống mở rộng trong core: boost cá nhân/toàn server, daily quest, tug PvP và ticket premium.",
    html: `<div class="content-grid"><div class="doc-card third"><h3>Boost</h3><p><code>gui/boost-menu.yml</code> định nghĩa button/cost PlayerPoints cho boost <code>EXP</code>, <code>GOLD</code>, <code>WEAKEN</code>, <code>POWER</code>, <code>EXCLUSIVE</code>. Admin có thể cấp player/global bằng command.</p></div><div class="doc-card third"><h3>Daily quest</h3><p><code>daily-quests.yml</code> có <code>quests-per-day</code> và các type: <code>CATCH_ANY</code>, <code>CATCH_FISH</code>, <code>CATCH_EXCLUSIVE</code>, <code>CATCH_WORLD</code>, <code>USE_BAIT</code>, <code>USE_BAIT_TYPE</code>, <code>WIN_TUG</code>. Reward chạy console command.</p></div><div class="doc-card third"><h3>Tug PvP</h3><p><code>tug-pvp.yml</code> điều khiển proximity join, control bar, cooldown, countdown, max participants, damage threshold và hook-PvP. Có thể tắt <code>enabled</code> hoàn toàn.</p></div><div class="doc-card"><h3>Premium ticket</h3><p>Core lưu ticket theo player. Pool cho vào khi player có permission pool hoặc ticket còn hạn. <code>exit</code> trong pool đặt vị trí dịch chuyển người không còn quyền / bị chặn. Tách ticket admin khỏi permission rank để bán vé thời hạn mà không phải thay permissions.</p></div></div>`
  },
  {
    id: "integrations", title: "Tích hợp", icon: "plug", keywords: "integrations mythicmobs mmoitems mmocore vault playerpoints worldguard placeholderapi typewriter kamenu", desc: "Plugin nào cần cho từng chức năng và giới hạn của từng bridge.",
    html: `<div class="doc-card"><h3>Integration matrix</h3>${table(["Plugin", "CCVC dùng để làm gì"], [["PacketEvents", "Bắt buộc; packet/visual hệ thống câu."],["MythicMobs", "Spawn Mythic fish, <code>MYTHIC_PLAYER</code>/<code>MYTHIC_FISH</code> skill, damage bridge."],["MMOItems", "Fish reward, bait item, custom item stat mapping và category stats."],["MMOCore", "Stamina khi cast skill theo <code>fishing-skills.yml</code>."],["MythicLib", "Đọc/bridge item stat với MMOItems."],["WorldGuard", "Phát hiện region hồ trong <code>fish/spawns.yml</code> và premium pool."],["Vault", "Economy để bán cá và fee reset nếu chọn provider Vault."],["PlayerPoints", "Boost menu và fee reset nếu chọn provider PlayerPoints."],["PlaceholderAPI", "Expansion <code>%caucavancan_...%</code>."],["KaMenu", "Render <code>attribute-dialog.yml</code> thay vì fallback chest GUI."],["Typewriter", "Soft-dependency cho workflow server có Typewriter."]])}${callout("warn", "Tất cả là soft-dependency trừ PacketEvents. Chỉ bật/config một feature khi plugin cung cấp service tương ứng thực sự đang chạy.")}</div>`
  },
  {
    id: "placeholders", title: "PlaceholderAPI", icon: "braces", keywords: "placeholderapi placeholders caucavancan stats exp fish tug daily quest leaderboard", desc: "Danh sách placeholder do expansion %caucavancan_...% đăng ký.",
    html: `<div class="content-grid"><div class="doc-card"><h3>Player và phiên câu</h3>${table(["Placeholder", "Giá trị"], [["<code>%caucavancan_total_caught%</code>", "Tổng câu thành công."],["<code>%caucavancan_failed%</code>, <code>attempts</code>, <code>streak</code>, <code>best_streak</code>", "Thống kê cơ bản."],["<code>%caucavancan_success_rate%</code>", "Tỷ lệ thành công (%)."],["<code>%caucavancan_largest_weight%</code>, <code>total_weight</code>", "Cân lớn nhất/tổng cân."],["<code>%caucavancan_fishing_level%</code>, <code>character_exp%</code>, <code>next_level_exp%</code>", "Tiến trình character."],["<code>%caucavancan_attribute_points%</code>, <code>skill_points%</code>, <code>mana%</code>", "Tài nguyên character."],["<code>%caucavancan_is_fishing%</code>, <code>fish_name%</code>, <code>fish_id%</code>, <code>fish_rarity%</code>", "Trạng thái/cá đang đấu."],["<code>%caucavancan_fish_health%</code>, <code>fish_health_max%</code>, <code>line_current%</code>, <code>line_max%</code>", "Chỉ số session."],["<code>%caucavancan_tug_active%</code>, <code>tug_players%</code>, <code>tug_leader%</code>", "Tug PvP."]])}</div><div class="doc-card half"><h3>Placeholder động</h3><ul><li><code>%caucavancan_stat_&lt;stat-id&gt;%</code>: stat ID, dấu <code>_</code> chuyển thành <code>-</code>.</li><li><code>%caucavancan_attribute_&lt;id&gt;%</code>: level thuộc tính, ví dụ <code>attribute_khoe</code>.</li><li><code>%caucavancan_skill_level_&lt;id&gt;%</code>: skill level.</li><li><code>%caucavancan_bait_used_&lt;type&gt;%</code>: số mồi type đã dùng.</li><li><code>%caucavancan_daily_quest_1_id%</code>, <code>_type</code>, <code>_target</code>, <code>_required</code>, <code>_progress</code>, <code>_percent</code>, <code>_completed</code>.</li></ul></div><div class="doc-card half"><h3>Leaderboard</h3><p><code>%caucavancan_top_caught_1_name%</code>, <code>top_largest_1_value</code>, và <code>top_rare_1_fish</code> lấy entry hạng tương ứng. Hậu tố hỗ trợ <code>name/player</code>, <code>uuid</code>, <code>fish</code>, <code>value</code>.</p><p>Global: <code>latest_rare_fish</code>, <code>latest_rare_player</code>, <code>global_total_caught</code>, <code>active_sessions</code>.</p></div></div>`
  },
  {
    id: "api", title: "Developer API", icon: "code-2", keywords: "developer api fishingapi servicesmanager events java plugin integration", desc: "Lấy FishingApi qua Bukkit ServicesManager, thao tác session/character và nghe sự kiện công khai.",
    html: `<div class="content-grid"><div class="doc-card"><h3>Lấy service</h3><p>CCVC đăng ký <code>FishingApi</code> vào <code>ServicesManager</code> lúc enable với priority NORMAL. Khai báo CCVC là <code>softdepend</code> hoặc <code>depend</code> trong plugin của bạn, sau đó lấy service như ví dụ.</p>${codeBlock("Java", snippets.api, "java")}${callout("warn", "Gọi Bukkit API và FishingApi từ main thread. Luôn xử lý trường hợp service vắng mặt hoặc player không có active session; các hàm thay đổi session trả <code>false</code> khi không thực hiện được.")}</div><div class="doc-card"><h3>FishingApi đầy đủ</h3>${table(["Nhóm", "Phương thức public"], [["Fish registry", "<code>registerFish</code>, <code>unregisterFish</code>, <code>updateFish</code>, <code>forceBite</code>, <code>spawnFish</code>."],["Session", "<code>session</code> trả <code>Optional&lt;SessionSnapshot&gt;</code>; <code>damageFish</code>, <code>healFish</code>, <code>setFishHealth</code>, <code>addLine</code>, <code>setLine</code>, <code>cancel</code>."],["Bait/spawn", "<code>setActiveBait</code>, <code>setSpawnWeightMultiplier</code>, <code>getSpawnWeightMultiplier</code>."],["Character", "<code>getPlayerLevel</code>, <code>getPlayerExp</code>, <code>addExp</code>, <code>get/addAttributePoints</code>, <code>get/add/set/removeSkillPoints</code>."],["Skill", "<code>castFishSkill</code>, <code>getSkillLevel</code>, <code>hasSkill</code>, <code>hasRequirement</code>, <code>upgradeSkill</code>, <code>setSkillLevel</code>."],["Stat/modifier", "<code>getStat</code>/<code>getFinalStat</code>, <code>getStatBreakdown</code>, <code>addModifier</code>, <code>removeModifier</code>, <code>calculateGold</code>, <code>getRodStats</code>, <code>getAccessoryStats</code>."],["Quest", "<code>dailyQuests(UUID)</code>."]])}</div><div class="doc-card half"><h3>Session snapshot</h3><p><code>SessionSnapshot</code> gồm <code>fishId</code>, <code>health</code>, <code>maxHealth</code>, <code>line</code>, <code>maxLine</code>. <code>damageFish</code>/<code>healFish</code>/<code>addLine</code> chỉ nhận amount hữu hạn và không âm; truyền giá trị sai sẽ ném <code>IllegalArgumentException</code>.</p></div><div class="doc-card half"><h3>Ví dụ thay đổi pull damage</h3>${codeBlock("Listener", snippets.listener, "java")}</div></div>`
  },
  {
    id: "events", title: "Developer events", icon: "radio", keywords: "bukkit events fishing start bite pull end line bait skill tug quest rod", desc: "14 Bukkit events công khai để plugin khác mở rộng hoặc theo dõi CCVC.",
    html: `<div class="content-grid"><div class="doc-card">${table(["Event", "Hành vi / dữ liệu chính"], [["<code>FishingStartEvent</code> (cancellable)", "Bắt đầu attempt; có <code>Player</code>."],["<code>FishBiteEvent</code> (cancellable)", "Cá đã được chọn cắn câu; <code>Player</code>, <code>FishDefinition</code>."],["<code>FishingPullEvent</code>", "Mỗi pull damage; có <code>get/setDamage</code> và <code>isCritical</code>."],["<code>FishingEndEvent</code>", "Kết thúc với fish + <code>Result</code>."],["<code>LineBrokenEvent</code>", "Dây đứt, line/maxLine."],["<code>RodBrokenEvent</code>", "Cần bị hỏng; ItemStack trả clone."],["<code>BaitConsumedEvent</code>", "Mồi được tiêu; Player, BaitType, bait clone."],["<code>PlayerSkillEvent</code> (cancellable)", "Skill của player: skillId, power có thể set."],["<code>FishSkillEvent</code> (cancellable)", "Skill/hiệu ứng phía fish: skillId, power có thể set."],["<code>DailyQuestProgressEvent</code>", "Quest progress; <code>isCompletedNow</code>."],["<code>TugStartEvent</code> (cancellable)", "Một lượt tug bắt đầu; tugNumber."],["<code>TugResultEvent</code>", "Kết quả <code>SUCCESS</code>/<code>FAILURE</code>/<code>TIMEOUT</code>."],["<code>TugEndEvent</code>", "Tổng số tug hoàn thành/thành công."]])}</div><div class="doc-card">${callout("", "Event có <code>FishDefinition</code> trả thông tin định nghĩa fish: ID, tên, mythic mob, health, pull, rarity, level, min/max weight, shadow size và bar settings. Với Bukkit event listener, dùng <code>ignoreCancelled = true</code> khi bạn không cần xử lý event bị hủy.")}</div></div>`
  },
  {
    id: "troubleshooting", title: "Xử lý lỗi config", icon: "circle-alert", keywords: "troubleshooting errors yaml unknown fish chance total loot missing exclusive", desc: "Các lỗi khởi động/reload thường gặp và cách sửa trực tiếp.",
    html: `<div class="doc-card"><h3>Lỗi thường gặp</h3>${table(["Log lỗi", "Nguyên nhân", "Cách sửa"], [["<code>fish chances must total 100%</code>", "Tổng số trong <code>fish</code> là 174, 99... thay vì 100.", "Sửa tỷ lệ của đúng region để tổng chính xác 100."],["<code>Unknown fish id: X</code>", "Spawn/loot tham chiếu ID không được nạp từ category fish.", "Tạo/sửa file <code>X.yml</code>, hoặc dùng đúng ID đang tồn tại."],["<code>exclusive-fish id must also be in fish: X</code>", "ID exclusive không có trong map fish của cùng hồ.", "Thêm ID X vào map <code>fish</code> và cân lại tổng 100."],["<code>loot.yml is missing rewards for configured fish</code>", "Có fish spawn nhưng thiếu <code>rewards.X</code>.", "Thêm full reward entry ở loot.yml."],["Không tạo MMOItems reward", "Type/ID mmoitems không tồn tại hoặc MMOItems không sẵn sàng.", "Kiểm tra type, ID, item-types và log MMOItems."],["Không vào premium", "Thiếu permission/ticket hoặc level.", "Kiểm tra <code>permission</code>, ticket, <code>required-level</code> và region."],["Skill Mythic không gây damage CCVC", "ID, skill target hoặc biến damage sai.", "Dùng <code>MYTHIC_PLAYER</code>, target <code>@target</code> và <code>&lt;skill.var.ccvc_skill_damage&gt;</code>."]])}${callout("danger", "Core giữ cấu hình cũ khi reload thất bại. Khi enable lần đầu mà config invalid, plugin tắt để không chạy với trạng thái dở dang. Luôn đọc dòng lỗi đầu tiên chứa tên file/key.")}</div>`
  },
  {
    id: "release", title: "Phiên bản và đóng góp", icon: "git-branch", keywords: "version source github build contribution changelog", desc: "Thông tin source, build và nguyên tắc cập nhật wiki.",
    html: `<div class="content-grid"><div class="doc-card half"><h3>Phiên bản tài liệu</h3><p>Wiki này khớp source <strong>CauCaVanCanCore ${VERSION}</strong>, bao gồm attribute KaMenu dialog, fee reset config, trọng số large premium 0.05, EXP/hologram, stamina skill, công thức bán cá và API <code>FishingApi</code>.</p>${pills(["Java 25", "Maven", "Spigot/Paper API 26.1.2", "PacketEvents 2.13.0"], "good")}</div><div class="doc-card half"><h3>Repository</h3><p><a class="text-button" href="https://github.com/NguyenSonhoa/CauCaVanCanWiki" target="_blank" rel="noreferrer">${icon("github", 16)} Repository wiki</a></p><p>Source core hiện được đối chiếu từ workspace triển khai. Khi core đổi key/API, cập nhật section liên quan và ghi rõ version để admin không copy config của bản khác.</p></div></div>`
  }
];

const header = document.getElementById("siteHeader");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");
const footer = document.getElementById("siteFooter");
let searchActive = -1;

function renderHeader() {
  header.innerHTML = `<div class="header-inner"><div class="brand"><div class="brand-mark">${icon("fish", 22)}</div><div><h1>CauCaVanCanCore</h1><p>Wiki ${VERSION} · Admin & Developer</p></div></div><div class="search-wrap"><i class="search-icon" data-lucide="search"></i><input id="searchInput" class="search-input" type="search" placeholder="Tìm lệnh, config, API, lỗi..." autocomplete="off"><span class="search-kbd">/</span><div id="searchResults" class="search-results"></div></div><div class="header-actions"><a class="text-button" href="https://github.com/NguyenSonhoa/CauCaVanCanWiki" target="_blank" rel="noreferrer">${icon("github", 16)} Wiki</a><button id="themeToggle" class="icon-button" type="button" title="Đổi giao diện">${icon("sun", 18)}</button></div></div>`;
}

function renderSidebar() {
  sidebar.innerHTML = `<div class="sidebar-card"><div class="sidebar-title">Tài liệu</div><nav class="nav-list">${sections.map((section) => `<button class="nav-link" type="button" data-section="${section.id}">${icon(section.icon)}<span>${section.title}</span></button>`).join("")}</nav></div>`;
}

function renderMain() {
  mainContent.innerHTML = sections.map((section) => `<section id="${section.id}" class="section"><div class="section-hero"><div class="eyebrow">${icon(section.icon, 15)} CAUCAVANCANCORE WIKI</div><h2>${section.title}</h2><p>${section.desc}</p></div>${section.html}</section>`).join("");
}

function currentSection() {
  const requested = window.location.hash.slice(1);
  return sections.some((section) => section.id === requested) ? requested : "home";
}

function activate(id, focus = false) {
  document.querySelectorAll(".section").forEach((element) => element.classList.toggle("active", element.id === id));
  document.querySelectorAll(".nav-link").forEach((element) => element.classList.toggle("active", element.dataset.section === id));
  if (window.location.hash.slice(1) !== id) window.history.replaceState(null, "", `#${id}`);
  if (focus) mainContent.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeSearch() {
  document.getElementById("searchResults").classList.remove("open");
  searchActive = -1;
}

function showSearch(value) {
  const results = document.getElementById("searchResults");
  const query = value.trim().toLowerCase();
  if (!query) return closeSearch();
  const matches = sections.filter((section) => `${section.title} ${section.desc} ${section.keywords}`.toLowerCase().includes(query)).slice(0, 8);
  results.innerHTML = matches.length ? matches.map((section, index) => `<button class="search-result ${index === 0 ? "active" : ""}" type="button" data-section="${section.id}">${icon(section.icon, 18)}<span><strong>${section.title}</strong><span>${section.desc}</span></span></button>`).join("") : `<div class="search-result"><span><strong>Không tìm thấy</strong><span>Thử một từ khóa khác.</span></span></div>`;
  results.classList.toggle("open", matches.length > 0);
  searchActive = matches.length ? 0 : -1;
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-section]");
    if (target) { closeSearch(); activate(target.dataset.section, true); }
    const copy = event.target.closest("[data-copy-target]");
    if (copy) {
      const code = document.getElementById(copy.dataset.copyTarget)?.innerText || "";
      navigator.clipboard?.writeText(code);
      const original = copy.innerHTML;
      copy.textContent = "Đã sao chép";
      setTimeout(() => { copy.innerHTML = original; if (window.lucide) window.lucide.createIcons(); }, 1200);
    }
    if (!event.target.closest(".search-wrap")) closeSearch();
  });
  document.querySelector("#themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("ccvc-wiki-theme", document.body.classList.contains("light") ? "light" : "dark");
  });
  const input = document.getElementById("searchInput");
  input.addEventListener("input", () => showSearch(input.value));
  input.addEventListener("keydown", (event) => {
    const choices = [...document.querySelectorAll(".search-result[data-section]")];
    if (event.key === "ArrowDown" && choices.length) { event.preventDefault(); searchActive = (searchActive + 1) % choices.length; }
    else if (event.key === "ArrowUp" && choices.length) { event.preventDefault(); searchActive = (searchActive - 1 + choices.length) % choices.length; }
    else if (event.key === "Enter" && choices[searchActive]) { event.preventDefault(); choices[searchActive].click(); return; }
    else if (event.key === "Escape") { closeSearch(); input.blur(); return; }
    else return;
    choices.forEach((choice, index) => choice.classList.toggle("active", index === searchActive));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== input) { event.preventDefault(); input.focus(); }
  });
  window.addEventListener("hashchange", () => activate(currentSection()));
}

function init() {
  renderHeader(); renderSidebar(); renderMain();
  footer.innerHTML = `CauCaVanCanCore Wiki · Source version ${VERSION} · Nội dung được đối chiếu từ core và config mặc định.`;
  if (localStorage.getItem("ccvc-wiki-theme") === "light") document.body.classList.add("light");
  bindEvents(); activate(currentSection());
  if (window.lucide) window.lucide.createIcons();
}

init();
